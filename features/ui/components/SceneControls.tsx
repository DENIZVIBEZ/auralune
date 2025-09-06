
import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../../app/store';
import { SceneRegistry } from '../../scenes/SceneRegistry';
import { theme } from '../theme';
import type { SceneParam } from '../../../types/scene';
import { generatePalette } from '../../ai/PaletteGenerator';

const AIPaletteGenerator = () => {
    const { setSceneParam } = useAppStore();
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError(null);
        try {
            const palette = await generatePalette(prompt);
            if (Object.keys(palette).length === 0) {
                setError("AI could not generate colors for this scene.");
            } else {
                // Apply the new colors to the scene
                for (const [key, value] of Object.entries(palette)) {
                    setSceneParam(key, value);
                }
            }
        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const aiSectionStyle: React.CSSProperties = {
        padding: '10px',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        border: `1px solid ${theme.colors.primary}`,
        borderRadius: '4px',
        marginTop: '15px',
        marginBottom: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    };

    const aiLabelStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: 'bold',
        fontSize: '14px',
        color: theme.colors.primary,
    };
    
    const buttonStyle: React.CSSProperties = {
        ...theme.styles.button,
        transition: 'background-color 0.3s, opacity 0.3s',
    };
    
    if (isLoading) {
        buttonStyle.opacity = 0.7;
    }

    const errorStyle: React.CSSProperties = {
        fontSize: '12px',
        color: theme.colors.error,
        margin: '4px 0 0 0',
    };

    return (
        <div style={aiSectionStyle}>
            <label style={aiLabelStyle}>
                <span style={{ fontSize: '18px' }}>🎨</span>
                <span>AI Color Palette</span>
            </label>
            <p style={{fontSize: '12px', margin: 0, opacity: 0.8}}>Describe a theme (e.g., "Synthwave Sunset")</p>
            <input
                type="text"
                placeholder="Enter theme..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                style={theme.styles.input}
                disabled={isLoading}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleGenerate();
                }}
            />
            <button
                style={buttonStyle}
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
            >
                {isLoading ? 'Generating...' : '✨ Generate'}
            </button>
            {error && <p style={errorStyle}>{error}</p>}
        </div>
    );
};


const SceneControl: React.FC<{ paramKey: string; schema: SceneParam }> = ({ paramKey, schema }) => {
    const { sceneParams, setSceneParam } = useAppStore();
    const activeSceneDef = SceneRegistry.get(useAppStore.getState().activeSceneId);
    
    if (!activeSceneDef) return null;
    const defaultValue = activeSceneDef.defaultParams[paramKey];
    const value = sceneParams[paramKey] ?? defaultValue;

    const labelStyles: React.CSSProperties = {
        color: theme.colors.primary,
        fontSize: theme.typography.smallSize,
        fontWeight: 'bold',
        marginBottom: '4px',
        display: 'block'
    };

    const inputStyles = { ...theme.styles.input, width: '100%' };
    // Fix: Cast style object to React.CSSProperties to handle non-standard property types.
    const sliderStyles = { ...theme.styles.slider } as React.CSSProperties;

    switch(schema.type) {
        case 'number':
            return (
                <div>
                    <label style={labelStyles}>{schema.label}: {Number(value).toFixed(2)}</label>
                    <input 
                        type="range"
                        min={schema.min}
                        max={schema.max}
                        step={schema.step}
                        value={value}
                        onChange={(e) => setSceneParam(paramKey, parseFloat(e.target.value))}
                        style={sliderStyles}
                    />
                </div>
            );
        case 'color':
            return (
                <div>
                     <label style={labelStyles}>{schema.label}</label>
                     <input
                        type="color"
                        value={value}
                        onChange={(e) => setSceneParam(paramKey, e.target.value)}
                        style={{ ...inputStyles, padding: '2px', height: '36px' }}
                     />
                </div>
            );
        case 'boolean':
            return (
                 <div style={{ paddingTop: '8px' }}>
                    <label style={{...labelStyles, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none'}}>
                        <input
                            type="checkbox"
                            checked={!!value}
                            onChange={(e) => setSceneParam(paramKey, e.target.checked)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: theme.colors.primary }}
                        />
                        {schema.label}
                    </label>
                </div>
            );
        case 'select':
            return (
                <div>
                    <label style={labelStyles}>{schema.label}</label>
                    <select
                        value={value}
                        onChange={(e) => setSceneParam(paramKey, e.target.value)}
                        style={inputStyles}
                    >
                        {schema.options?.map(option => (
                            <option key={option} value={option} style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            );
        default:
            return null;
    }
};

export default function SceneControls() {
    const { activeSceneId, sceneParams, setActiveScene, setSceneParam, resetSceneParams } = useAppStore();
    const scenes = SceneRegistry.list() || [];
    const activeSceneDef = SceneRegistry.get(activeSceneId);

    const handleSceneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSceneId = e.target.value;
        setActiveScene(newSceneId);
        const newSceneDef = SceneRegistry.get(newSceneId);
        if (newSceneDef) {
            resetSceneParams(); // Clear old params
            // Set new default params
            Object.entries(newSceneDef.defaultParams).forEach(([key, value]) => {
                setSceneParam(key, value);
            });
        }
    };
    
    // Set initial default params on mount
    useEffect(() => {
        if (activeSceneDef) {
             resetSceneParams();
             Object.entries(activeSceneDef.defaultParams).forEach(([key, value]) => {
                setSceneParam(key, value);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSceneId]);


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
    
    const paramsContainerStyle: React.CSSProperties = {
        borderTop: `1px solid rgba(212, 175, 55, 0.3)`,
        paddingTop: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    }
    
    return (
        <div style={controlStyles}>
            <div>
                <label style={labelStyles}>Szene</label>
                <select
                    value={activeSceneId}
                    onChange={handleSceneChange}
                    style={{ ...theme.styles.input, width: '100%'}}
                >
                    {scenes.map(scene => (
                         <option key={scene.id} value={scene.id} style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
                             {scene.name}
                         </option>
                    ))}
                </select>
            </div>
            
            <AIPaletteGenerator />

            <div style={paramsContainerStyle}>
                {activeSceneDef && Object.entries(activeSceneDef.paramsSchema)
                    .filter(([key]) => {
                        // Conditional rendering for ParticleSwarmScene modes
                        if (activeSceneId === 'particle-swarm') {
                            const mode = sceneParams.visualizerMode ?? activeSceneDef.defaultParams.visualizerMode;

                            // Always show the mode selector and shared params
                            const sharedParams = ['visualizerMode', 'particleShape', 'particleSize', 'beatPulse'];
                            if (sharedParams.includes(key)) return true;

                            const swarmParams = ['baseColor', 'colorMode', 'velocityColor', 'bassGlowColor', 'bassReactivity', 'swirlIntensity', 'introDuration'];
                            const galaxyParams = ['galaxyRadius', 'rotationSpeed', 'pulseReactivity', 'twinkleSpeed', 'twinkleIntensity'];
                            const physicsParams = ['gravity', 'boxSize', 'bounciness', 'friction', 'initialVelocityBoost'];
                            
                            switch(mode) {
                                case 'Swarm':
                                    if (swarmParams.includes(key)) {
                                        // Conditional color controls within swarm mode
                                        const colorMode = sceneParams.colorMode ?? activeSceneDef.defaultParams.colorMode;
                                        if (key === 'velocityColor' && colorMode !== 'Velocity') return false;
                                        if (key === 'bassGlowColor' && colorMode !== 'Bass Glow') return false;
                                        return true;
                                    }
                                    return false;
                                case 'Galaxy':
                                    return galaxyParams.includes(key);
                                case 'Physics Box':
                                    return physicsParams.includes(key);
                                default:
                                    return false;
                            }
                        }
                        return true;
                    })
                    .map(([key, schema]) => (
                        <SceneControl key={key} paramKey={key} schema={schema} />
                    ))}
            </div>
        </div>
    );
}