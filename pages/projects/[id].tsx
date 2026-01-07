import React, { useState, useEffect } from 'react';
import ClientSide from '../../components/ClientSide';
import Layout from '../../core/Layout';
import { useRouter } from 'next/router';
import { Button, H1, H5, Card, Intent, FileInput, Spinner, Breadcrumbs, IBreadcrumbProps, Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import SchemaMapper from '../../components/SchemaMapper';
import ProjectPropertiesEditor from '../../components/ProjectPropertiesEditor';

const ProjectDetailPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [locationCsv, setLocationCsv] = useState('');
    const [locationMapping, setLocationMapping] = useState<Record<string, string>>({});

    const [flowCsv, setFlowCsv] = useState('');
    const [flowMapping, setFlowMapping] = useState<Record<string, string>>({});

    const [propertiesConfig, setPropertiesConfig] = useState<Record<string, string>>({});

    useEffect(() => {
        if (id) {
            fetchProject();
        }
    }, [id]);

    const fetchProject = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/projects/${id}`);
            const data = await res.json();
            setProject(data);
            if (data.locationData) {
                setLocationCsv(data.locationData.csvContent);
                setLocationMapping(JSON.parse(data.locationData.mapping));
            }
            if (data.flowData) {
                setFlowCsv(data.flowData.csvContent);
                setFlowMapping(JSON.parse(data.flowData.mapping));
            }
            if (data.propertiesData) {
                setPropertiesConfig(JSON.parse(data.propertiesData.config));
            }
        } catch (error) {
            console.error('Failed to fetch project', error);
        }
        setLoading(false);
    };

    const handleFileUpload = (type: 'location' | 'flow') => (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                if (type === 'location') setLocationCsv(text);
                else setFlowCsv(text);
            };
            reader.readAsText(file);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch(`/api/projects/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    locationData: locationCsv ? { csvContent: locationCsv, mapping: locationMapping } : null,
                    flowData: flowCsv ? { csvContent: flowCsv, mapping: flowMapping } : null,
                    propertiesData: { config: propertiesConfig },
                }),
            });
            alert('Project saved successfully!');
        } catch (error) {
            console.error('Failed to save project', error);
            alert('Failed to save project.');
        }
        setSaving(false);
    };

    const handleVisualize = () => {
        router.push(`/in-browser?project=${id}`);
    };

    const BREADCRUMBS: IBreadcrumbProps[] = [
        { href: '/projects', icon: IconNames.LIST, text: 'Projects' },
        { text: project?.name || 'Loading...' },
    ];

    if (loading) return <ClientSide><Layout><div style={{ textAlign: 'center', padding: '100px' }}><Spinner /></div></Layout></ClientSide>;
    if (!project) return <ClientSide><Layout><div style={{ textAlign: 'center', padding: '100px' }}><Spinner /></div></Layout></ClientSide>;

    return (
        <ClientSide>
            <Layout>
                <div style={{ padding: '20px 40px', maxWidth: '1200px', margin: '0 auto' }}>
                    <Breadcrumbs items={BREADCRUMBS} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', marginTop: '20px' }}>
                        <div>
                            <H1>{project.name}</H1>
                            <p style={{ opacity: 0.7 }}>{project.description}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button icon={IconNames.SAVED} onClick={handleSave} loading={saving}>Save Changes</Button>
                            <Button
                                icon={IconNames.CHART}
                                intent={Intent.SUCCESS}
                                large={true}
                                onClick={handleVisualize}
                                disabled={!locationCsv || !flowCsv || !propertiesConfig || Object.keys(propertiesConfig).length === 0}
                                title={!propertiesConfig || Object.keys(propertiesConfig).length === 0 ? 'Please configure and save properties first' : ''}
                            >
                                Visualize Flow Map
                            </Button>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                        <section>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <H5>1. Locations Data</H5>
                                <FileInput text="Change CSV..." onInputChange={handleFileUpload('location')} />
                            </div>
                            {locationCsv ? (
                                <SchemaMapper
                                    csv={locationCsv}
                                    type="locations"
                                    initialMapping={locationMapping}
                                    onMappingChange={setLocationMapping}
                                />
                            ) : (
                                <Card elevation={0} style={{ padding: '40px', textAlign: 'center', border: '1px dashed #ccc' }}>
                                    <Icon icon={IconNames.CLOUD_UPLOAD} size={40} style={{ opacity: 0.3, marginBottom: '10px' }} />
                                    <p>Upload a CSV file containing your location data.</p>
                                    <FileInput text="Upload Locations CSV" onInputChange={handleFileUpload('location')} />
                                </Card>
                            )}
                        </section>

                        <section>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <H5>2. Flows Data</H5>
                                <FileInput text="Change CSV..." onInputChange={handleFileUpload('flow')} />
                            </div>
                            {flowCsv ? (
                                <SchemaMapper
                                    csv={flowCsv}
                                    type="flows"
                                    initialMapping={flowMapping}
                                    onMappingChange={setFlowMapping}
                                />
                            ) : (
                                <Card elevation={0} style={{ padding: '40px', textAlign: 'center', border: '1px dashed #ccc' }}>
                                    <Icon icon={IconNames.CLOUD_UPLOAD} size={40} style={{ opacity: 0.3, marginBottom: '10px' }} />
                                    <p>Upload a CSV file containing your flow data.</p>
                                    <FileInput text="Upload Flows CSV" onInputChange={handleFileUpload('flow')} />
                                </Card>
                            )}
                        </section>

                        <section>
                            <div style={{ marginTop: '30px' }}>
                                <H5>3. Properties Settings</H5>
                                <p style={{ fontSize: '13px', opacity: 0.7, marginBottom: '10px' }}>
                                    Configure visualization settings. You must save properties before visualizing.
                                </p>
                                <ProjectPropertiesEditor
                                    initialConfig={propertiesConfig}
                                    onConfigChange={setPropertiesConfig}
                                />
                            </div>
                        </section>
                    </div>
                </div>
            </Layout>
        </ClientSide>
    );
};

export default ProjectDetailPage;
