import React, { useState, useEffect } from 'react';
import { HTMLTable, HTMLSelect, Card, H5, Callout, Intent } from '@blueprintjs/core';
import { dsvFormat } from 'd3-dsv';

interface SchemaMapperProps {
    csv: string;
    type: 'locations' | 'flows';
    onMappingChange: (mapping: Record<string, string>) => void;
    initialMapping?: Record<string, string>;
}

const REQUIRED_FIELDS = {
    locations: ['id', 'lat', 'lon', 'name'],
    flows: ['origin', 'dest', 'count', 'time'],
};

const SchemaMapper: React.FC<SchemaMapperProps> = ({ csv, type, onMappingChange, initialMapping = {} }) => {
    const [headers, setHeaders] = useState<string[]>([]);
    const [mapping, setMapping] = useState<Record<string, string>>(initialMapping);
    const [preview, setPreview] = useState<any[]>([]);

    useEffect(() => {
        if (csv) {
            const rows = dsvFormat(',').parse(csv);
            setHeaders(rows.columns || []);
            setPreview(rows.slice(0, 5));

            // Attempt auto-mapping if no initial mapping
            if (Object.keys(initialMapping).length === 0) {
                const newMapping: Record<string, string> = {};
                const cols = rows.columns || [];
                REQUIRED_FIELDS[type].forEach(field => {
                    const match = cols.find(c => {
                        const lc = c.toLowerCase();
                        const lf = field.toLowerCase();
                        return lc === lf ||
                            (field === 'lat' && lc === 'latitude') ||
                            (field === 'lon' && (lc === 'longitude' || lc === 'lng')) ||
                            (field === 'time' && (lc === 'date' || lc === 'timestamp' || lc === 'datetime' || lc === 'year' || lc === 'month'));
                    });
                    if (match) newMapping[field] = match;
                });
                setMapping(newMapping);
                onMappingChange(newMapping);
            }
        }
    }, [csv, type]);

    const handleSelectChange = (field: string, value: string) => {
        const newMapping = { ...mapping, [field]: value };
        setMapping(newMapping);
        onMappingChange(newMapping);
    };

    return (
        <Card elevation={0} style={{ padding: '15px' }}>
            <H5>{type === 'locations' ? 'Location Mapping' : 'Flow Mapping'}</H5>
            <HTMLTable striped={true} style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Field</th>
                        <th>CSV Column</th>
                    </tr>
                </thead>
                <tbody>
                    {REQUIRED_FIELDS[type].map(field => (
                        <tr key={field}>
                            <td><strong>{field}</strong></td>
                            <td>
                                <HTMLSelect
                                    value={mapping[field] || ''}
                                    onChange={(e) => handleSelectChange(field, e.currentTarget.value)}
                                    fill={true}
                                >
                                    <option value="">Select column...</option>
                                    {headers.map(h => <option key={h} value={h}>{h}</option>)}
                                </HTMLSelect>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </HTMLTable>

            <div style={{ marginTop: '15px' }}>
                <p style={{ fontSize: '11px', opacity: 0.6 }}>Data Preview (first 5 rows):</p>
                <div style={{ overflowX: 'auto', maxHeight: '150px' }}>
                    <HTMLTable condensed={true}>
                        <thead>
                            <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                            {preview.map((row, i) => (
                                <tr key={i}>{headers.map(h => <td key={h}>{row[h]}</td>)}</tr>
                            ))}
                        </tbody>
                    </HTMLTable>
                </div>
            </div>
        </Card>
    );
};

export default SchemaMapper;
