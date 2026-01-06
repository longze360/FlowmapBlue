import React, { useState, useEffect } from 'react';
import ClientSide from '../../components/ClientSide';
import Layout from '../../core/Layout';
import { Button, Card, H1, H5, Intent, NonIdealState, Spinner, Dialog, FormGroup, InputGroup, TextArea } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import Link from 'next/link';

const ProjectsPage = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', description: '' });

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreate = async () => {
        if (!newProject.name) return;
        try {
            await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProject),
            });
            setIsDialogOpen(false);
            setNewProject({ name: '', description: '' });
            fetchProjects();
        } catch (error) {
            console.error('Failed to create project', error);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            fetchProjects();
        } catch (error) {
            console.error('Failed to delete project', error);
        }
    };

    return (
        <ClientSide>
            <Layout>
                <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <H1>Studio Projects</H1>
                        <Button icon={IconNames.PLUS} intent={Intent.PRIMARY} large={true} onClick={() => setIsDialogOpen(true)}>
                            New Project
                        </Button>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <Spinner size={50} />
                        </div>
                    ) : projects.length === 0 ? (
                        <NonIdealState
                            icon={IconNames.DOCUMENT}
                            title="No projects yet"
                            description="Create a project to start managing your flow map data."
                        />
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {projects.map((p) => (
                                <Link key={p.id} href={`/projects/${p.id}`} passHref legacyBehavior>
                                    <Card interactive={true} style={{ display: 'flex', flexDirection: 'column', height: '100%' }} elevation={0}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <H5>{p.name}</H5>
                                            <Button icon={IconNames.TRASH} minimal={true} intent={Intent.DANGER} onClick={(e) => handleDelete(p.id, e)} />
                                        </div>
                                        <p style={{ flexGrow: 1, opacity: 0.8, fontSize: '13px' }}>{p.description || 'No description'}</p>
                                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px', fontSize: '12px', opacity: 0.6 }}>
                                            <span>{p.locationData ? '✓ Locations' : '○ Locations'}</span>
                                            <span>{p.flowData ? '✓ Flows' : '○ Flows'}</span>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}

                    <Dialog
                        title="Create New Project"
                        isOpen={isDialogOpen}
                        onClose={() => setIsDialogOpen(false)}
                        style={{ paddingBottom: '0' }}
                    >
                        <div style={{ padding: '20px' }}>
                            <FormGroup label="Project Name" labelFor="name-input" labelInfo="(required)">
                                <InputGroup
                                    id="name-input"
                                    placeholder="e.g. Urban Migration Analysis"
                                    value={newProject.name}
                                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                />
                            </FormGroup>
                            <FormGroup label="Description" labelFor="desc-input">
                                <TextArea
                                    id="desc-input"
                                    fill={true}
                                    placeholder="Give your project a brief description..."
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                />
                            </FormGroup>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button intent={Intent.PRIMARY} onClick={handleCreate}>Create Project</Button>
                            </div>
                        </div>
                    </Dialog>
                </div>
            </Layout>
        </ClientSide>
    );
};

export default ProjectsPage;
