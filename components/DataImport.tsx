import React, { useCallback, useState } from 'react';
import { Button, Card, ControlGroup, FileInput, H5, Icon, Intent, TextArea } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { dsvFormat } from 'd3-dsv';
import { prepareFlows } from '../core';
import styled from '@emotion/styled';

const ImportContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EditorGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

interface DataImportProps {
    onVisualize: (data: { locations: any[]; flows: any[] }) => void;
    initialLocations?: string;
    initialFlows?: string;
}

const DataImport: React.FC<DataImportProps> = ({ onVisualize, initialLocations = '', initialFlows = '' }) => {
    const [locationsCsv, setLocationsCsv] = useState(initialLocations);
    const [flowsCsv, setFlowsCsv] = useState(initialFlows);

    const handleFileUpload = useCallback((type: 'locations' | 'flows') => (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                if (type === 'locations') setLocationsCsv(text);
                else setFlowsCsv(text);
            };
            reader.readAsText(file);
        }
    }, []);

    const handleVisualize = () => {
        try {
            const data = {
                locations: dsvFormat(',').parse(locationsCsv, (row: any) => ({
                    ...row,
                    lat: +row.lat,
                    lon: +row.lon,
                })),
                flows: prepareFlows(dsvFormat(',').parse(flowsCsv)),
            };
            onVisualize(data);
        } catch (error) {
            console.error('Error parsing CSV:', error);
            alert('Failed to parse CSV. Please check the format.');
        }
    };

    return (
        <ImportContainer>
            <EditorGrid>
                <Section>
                    <H5>Locations CSV</H5>
                    <p style={{ fontSize: '12px', opacity: 0.7 }}>Required columns: id, lat, lon, name</p>
                    <FileInput
                        text="Choose CSV file..."
                        onInputChange={handleFileUpload('locations')}
                        fill={true}
                    />
                    <TextArea
                        growVertically={true}
                        large={true}
                        intent={Intent.PRIMARY}
                        onChange={(event) => setLocationsCsv(event.target.value)}
                        value={locationsCsv}
                        rows={10}
                        style={{ fontFamily: 'monospace', fontSize: '12px' }}
                    />
                </Section>
                <Section>
                    <H5>Flows CSV</H5>
                    <p style={{ fontSize: '12px', opacity: 0.7 }}>Required columns: origin, dest, count. Optional: time, color.</p>
                    <FileInput
                        text="Choose CSV file..."
                        onInputChange={handleFileUpload('flows')}
                        fill={true}
                    />
                    <TextArea
                        growVertically={true}
                        large={true}
                        intent={Intent.PRIMARY}
                        onChange={(event) => setFlowsCsv(event.target.value)}
                        value={flowsCsv}
                        rows={10}
                        style={{ fontFamily: 'monospace', fontSize: '12px' }}
                    />
                </Section>
            </EditorGrid>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button
                    icon={IconNames.CHART}
                    large={true}
                    intent={Intent.SUCCESS}
                    onClick={handleVisualize}
                >
                    Visualize Data
                </Button>
            </div>
        </ImportContainer>
    );
};

export default DataImport;
