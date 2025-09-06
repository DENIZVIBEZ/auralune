import React, { useState } from 'react';
import { useAppStore } from '../../../app/store';
import { theme } from '../theme';

export default function LooksControls() {
    const { looks: rawLooks, saveLook, loadLook, deleteLook } = useAppStore();
    
    // CRITICAL FIX: Ensure looks is always an array
    const looks = rawLooks || [];
    
    const [lookName, setLookName] = useState('');
    const [selectedLookId, setSelectedLookId] = useState('');

    const handleSaveLook = () => {
        if (lookName.trim()) {
            saveLook(lookName.trim());
            setLookName('');
        }
    };

    const handleDeleteLook = () => {
        if (selectedLookId) {
            deleteLook(selectedLookId);
            setSelectedLookId('');
        }
    };

    const handleLoadLook = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        setSelectedLookId(id);
        if (id) {
            loadLook(id);
        }
    };

    const controlStyles: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    };

    const labelStyles: React.CSSProperties = {
        color: theme.colors.primary,
        fontSize: theme.typography.smallSize,
        fontWeight: 'bold',
        marginBottom: '4px',
        display: 'block'
    };

    const selectStyles: React.CSSProperties = {
        ...theme.styles.input,
        width: '100%',
    };
    
    const presetControlRowStyle: React.CSSProperties = {
        display: 'flex',
        gap: '8px',
        alignItems: 'center'
    };

    const smallButtonStyle: React.CSSProperties = {
        ...theme.styles.button,
        padding: '4px 8px',
        fontSize: '12px'
    };

    return (
        <div style={controlStyles}>
            <div>
                <label style={labelStyles}>Load Look</label>
                <div style={presetControlRowStyle}>
                    <select
                        value={selectedLookId}
                        onChange={handleLoadLook}
                        style={{ ...selectStyles, flexGrow: 1 }}
                    >
                        <option value="">Select a Look...</option>
                        {looks.map(look => (
                            <option key={look.id} value={look.id} style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
                                {look.name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleDeleteLook}
                        style={{...smallButtonStyle, color: theme.colors.error, borderColor: theme.colors.error}}
                        disabled={!selectedLookId}
                    >
                        Delete
                    </button>
                </div>
            </div>
             <div style={{ borderTop: `1px solid rgba(212, 175, 55, 0.3)`, marginTop: '5px', paddingTop: '15px' }}>
                <label style={labelStyles}>Save Current Look</label>
                <div style={{ ...presetControlRowStyle }}>
                    <input
                        type="text"
                        placeholder="New look name..."
                        value={lookName}
                        onChange={(e) => setLookName(e.target.value)}
                        style={{ ...theme.styles.input, flexGrow: 1 }}
                         onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveLook();
                        }}
                    />
                    <button onClick={handleSaveLook} style={smallButtonStyle} disabled={!lookName.trim()}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}