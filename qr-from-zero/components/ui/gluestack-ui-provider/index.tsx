import React, {useEffect} from 'react';
import {config} from './config';
import {View, ViewProps} from 'react-native';
import {OverlayProvider} from '@gluestack-ui/core/overlay/creator';
import {ToastProvider} from '@gluestack-ui/core/toast/creator';
import {useColorScheme} from 'nativewind';
import {useSettings} from "@/contexts/SettingsContext";

// export type ModeType = 'light' | 'dark' | 'system';

export function GluestackUIProvider({
                                        // mode = 'light',
                                        ...props
                                    }: {
    // mode?: ModeType;
    children?: React.ReactNode;
    style?: ViewProps['style'];
}) {
    const {colorScheme, setColorScheme} = useColorScheme();

    const {settings} = useSettings();

    // const resolvedTheme = settings.theme === 'system'
    //     ? (colorScheme === 'dark' ? 'dark' : 'light')
    //     : settings.theme;

    useEffect(() => {
        setColorScheme(settings.theme);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings.theme]);

    return (
        <View
            style={[
                config[colorScheme!],
                {flex: 1, height: '100%', width: '100%'},
                props.style,
            ]}
        >
            <OverlayProvider>
                <ToastProvider>{props.children}</ToastProvider>
            </OverlayProvider>
        </View>
    );
}
