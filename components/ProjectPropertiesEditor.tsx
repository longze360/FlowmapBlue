import React, { useState, useEffect } from 'react';
import { Card, FormGroup, HTMLSelect, Switch, Slider, H5, Button, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { PROPERTY_TEMPLATES } from '../lib/templates';
import { COLOR_SCHEME_KEYS } from '../core/colors';

interface ProjectPropertiesEditorProps {
    initialConfig: Record<string, string>;
    onConfigChange: (config: Record<string, string>) => void;
}

const ProjectPropertiesEditor: React.FC<ProjectPropertiesEditorProps> = ({
    initialConfig,
    onConfigChange,
}) => {
    const [config, setConfig] = useState<Record<string, string>>({
        'colors.darkMode': 'no',
        ...initialConfig
    });
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');

    useEffect(() => {
        setConfig({
            'colors.darkMode': 'no',
            ...initialConfig
        });
    }, [initialConfig]);

    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const templateName = e.target.value;
        setSelectedTemplate(templateName);

        if (templateName) {
            const template = PROPERTY_TEMPLATES.find(t => t.name === templateName);
            if (template) {
                const newConfig = { ...config, ...template.config };
                setConfig(newConfig);
                onConfigChange(newConfig);
            }
        }
    };

    const handleConfigChange = (key: string, value: string) => {
        const newConfig = { ...config, [key]: value };
        setConfig(newConfig);
        onConfigChange(newConfig);
    };

    const handleToggle = (key: string, checked: boolean) => {
        handleConfigChange(key, checked ? 'yes' : 'no');
    };

    const handleSliderChange = (key: string, value: number) => {
        handleConfigChange(key, value.toString());
    };

    return (
        <Card elevation={0} style={{ padding: '20px', border: '1px solid #ccc' }}>
            <H5 style={{ marginBottom: '20px' }}>Properties Settings</H5>

            {/* Template Selector */}
            <FormGroup label="Style Template" labelInfo="(optional)">
                <HTMLSelect
                    fill
                    value={selectedTemplate}
                    onChange={handleTemplateChange}
                    iconProps={{ icon: IconNames.STYLE }}
                >
                    <option value="">-- Select a preset template --</option>
                    <optgroup label="Standard Templates">
                        {PROPERTY_TEMPLATES.filter(t => !t.hasTimeData).map(template => (
                            <option key={template.name} value={template.name}>
                                {template.name} - {template.description}
                            </option>
                        ))}
                    </optgroup>
                    <optgroup label="Time-Series Templates (for temporal data)">
                        {PROPERTY_TEMPLATES.filter(t => t.hasTimeData).map(template => (
                            <option key={template.name} value={template.name}>
                                {template.name} - {template.description}
                            </option>
                        ))}
                    </optgroup>
                </HTMLSelect>
            </FormGroup>

            {/* Time-series info callout */}
            {selectedTemplate && PROPERTY_TEMPLATES.find(t => t.name === selectedTemplate)?.hasTimeData && (
                <div style={{
                    background: '#FFF3CD',
                    border: '1px solid #FF9800',
                    borderRadius: '4px',
                    padding: '12px',
                    marginTop: '10px',
                    fontSize: '13px'
                }}>
                    <strong>⚠️ Time-Series Template Selected</strong>
                    <p style={{ margin: '8px 0 0 0', fontWeight: 'bold' }}>
                        <strong>IMPORTANT: Your flow CSV MUST include a <code>time</code> column</strong> for the timeline to appear.
                    </p>
                    <p style={{ margin: '8px 0 0 0' }}>
                        Timeline features automatically activate when time data is detected:
                    </p>
                    <ul style={{ margin: '8px 0 0 20px', paddingLeft: 0 }}>
                        <li>Timeline slider with date/time display</li>
                        <li>Play/pause controls for animation</li>
                        <li>Drag to select time ranges</li>
                    </ul>
                    <p style={{ margin: '8px 0 0 0', fontSize: '12px', opacity: 0.8 }}>
                        Example CSV: <code>origin,dest,count,time</code><br />
                        Data row: <code>110105,110108,964931,2025/7/1</code>
                    </p>
                </div>
            )}

            <div style={{ borderTop: '1px solid #ddd', margin: '20px 0', paddingTop: '20px' }}>
                <p style={{ fontSize: '12px', opacity: 0.7, marginBottom: '15px' }}>
                    Customize individual settings below:
                </p>

                {/* Color Scheme */}
                <FormGroup label="Color Scheme">
                    <HTMLSelect
                        fill
                        value={config['colors.scheme'] || 'Default'}
                        onChange={(e) => handleConfigChange('colors.scheme', e.target.value)}
                    >
                        {COLOR_SCHEME_KEYS.map(scheme => (
                            <option key={scheme} value={scheme}>{scheme}</option>
                        ))}
                    </HTMLSelect>
                </FormGroup>

                {/* Dark Mode */}
                <FormGroup>
                    <Switch
                        checked={config['colors.darkMode'] === 'yes'}
                        label="Dark Mode"
                        onChange={(e) => handleToggle('colors.darkMode', (e.target as HTMLInputElement).checked)}
                    />
                </FormGroup>

                {/* Animate Flows */}
                <FormGroup>
                    <Switch
                        checked={config['animate.flows'] === 'yes'}
                        label="Animate Flows"
                        onChange={(e) => handleToggle('animate.flows', (e.target as HTMLInputElement).checked)}
                    />
                </FormGroup>

                {/* Clustering */}
                <FormGroup>
                    <Switch
                        checked={config['clustering'] === 'yes'}
                        label="Clustering"
                        onChange={(e) => handleToggle('clustering', (e.target as HTMLInputElement).checked)}
                    />
                </FormGroup>

                {/* Fade Amount */}
                <FormGroup label={`Fade Amount: ${config['fadeAmount'] || '45'}`}>
                    <Slider
                        min={0}
                        max={100}
                        stepSize={5}
                        labelRenderer={false}
                        value={parseInt(config['fadeAmount'] || '45')}
                        onChange={(value) => handleSliderChange('fadeAmount', value)}
                    />
                </FormGroup>

                {/* Base Map Opacity */}
                <FormGroup label={`Base Map Opacity: ${config['baseMapOpacity'] || '75'}`}>
                    <Slider
                        min={0}
                        max={100}
                        stepSize={5}
                        labelRenderer={false}
                        value={parseInt(config['baseMapOpacity'] || '75')}
                        onChange={(value) => handleSliderChange('baseMapOpacity', value)}
                    />
                </FormGroup>
            </div>
        </Card>
    );
};

export default ProjectPropertiesEditor;
