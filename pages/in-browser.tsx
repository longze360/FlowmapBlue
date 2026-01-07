import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import FlowMap, { DEFAULT_CONFIG, Flow, Location, MapContainer } from '../core';
import { PromiseState } from 'react-refetch';
import Layout from '../core/Layout';
import { useRouter } from 'next/router';
import md5 from 'blueimp-md5';
import DataImport from '../components/DataImport';
import { dsvFormat } from 'd3-dsv';
import { prepareFlows } from '../core';
import { Spinner } from '@blueprintjs/core';

import { Config } from '../core/types';

interface DataProps {
  locations: Location[];
  flows: Flow[];
  config?: Config;
}

const FlowMapContainer = (props: DataProps) => {
  const { flows, locations, config } = props;
  return (
    <MapContainer>
      <FlowMap
        inBrowser={true}
        flowsFetch={PromiseState.resolve(flows)}
        locationsFetch={PromiseState.resolve(locations)}
        config={config || DEFAULT_CONFIG}
        spreadSheetKey={undefined}
        flowsSheet={undefined}
      />
    </MapContainer>
  );
};

const Header = styled.div`
  padding: 40px 20px;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  text-align: center;
  margin-bottom: 30px;
  border-radius: 8px;
`;

const InBrowserFlowMap = () => {
  const initialLocations = `id,name,lat,lon
1,New York,40.713543,-74.011219
2,London,51.507425,-0.127738
3,Rio de Janeiro,-22.906241,-43.180244`;
  const initialFlows = `origin,dest,count
1,2,42
2,1,51
3,1,50
2,3,40
1,3,22
3,2,42`;

  const router = useRouter();
  const { hash, project: projectId } = router.query;
  const [data, setData] = useState<DataProps>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchProjectData(projectId as string);
    }
  }, [projectId]);

  const fetchProjectData = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${id}`);
      const project = await res.json();
      if (project && project.locationData && project.flowData) {
        const locMapping = JSON.parse(project.locationData.mapping);
        const flowMapping = JSON.parse(project.flowData.mapping);

        // Parse properties config if available
        let projectConfig: Config = DEFAULT_CONFIG;
        if (project.propertiesData && project.propertiesData.config) {
          const parsedConfig = JSON.parse(project.propertiesData.config);
          projectConfig = { ...DEFAULT_CONFIG, ...parsedConfig };
        }

        const parsedData = {
          locations: dsvFormat(',').parse(project.locationData.csvContent, (row: any) => ({
            ...row,
            id: row[locMapping.id || 'id'],
            name: row[locMapping.name || 'name'],
            lat: +row[locMapping.lat || 'lat'],
            lon: +row[locMapping.lon || 'lon'],
          })),
          flows: prepareFlows(dsvFormat(',').parse(project.flowData.csvContent, (row: any) => {
            const mappedRow: any = { ...row };
            if (flowMapping.origin) mappedRow.origin = row[flowMapping.origin];
            if (flowMapping.dest) mappedRow.dest = row[flowMapping.dest];
            if (flowMapping.count) mappedRow.count = +row[flowMapping.count];
            if (flowMapping.time) {
              const timeStr = row[flowMapping.time];
              // Convert time string to Date object
              mappedRow.time = timeStr ? new Date(timeStr) : undefined;
            }
            return mappedRow;
          })),
          config: projectConfig,
        };
        setData(parsedData);
      }
    } catch (error) {
      console.error('Failed to load project data', error);
    }
    setLoading(false);
  };

  const handleVisualize = (importedData: DataProps) => {
    setData(importedData);
    router.push({
      query: {
        hash: md5(JSON.stringify(importedData)),
      },
    });
  };

  if (loading || (projectId && !data)) return <Layout><div style={{ textAlign: 'center', padding: '100px' }}><Spinner /></div></Layout>;

  return data && (hash || projectId) ? (
    <FlowMapContainer {...data} />
  ) : (
    <Layout>
      <Header>
        <h1>Interactive Flow Map Explorer</h1>
        <p style={{ fontSize: '18px', opacity: 0.9 }}>
          Visualize your origin-destination data directly in the browser.
        </p>
      </Header>
      <section style={{ maxWidth: '800px', margin: '0 auto 30px', textAlign: 'center' }}>
        <p>
          Your data remains private and stays in your browser. No data is uploaded to any server.
          Use the editor below to paste your CSV data or upload files.
        </p>
      </section>

      <DataImport
        onVisualize={handleVisualize}
        initialLocations={initialLocations}
        initialFlows={initialFlows}
      />
    </Layout>
  );
};

export default InBrowserFlowMap;
