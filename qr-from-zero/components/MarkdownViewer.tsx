import React, {useMemo} from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
import {useSettings} from "@/contexts/SettingsContext";
import {useColorScheme} from "react-native";

interface Props {
    content: string;
}

export const MarkdownViewer: React.FC<Props> = ({ content }) => {

    const {settings} = useSettings();

    const systemColorScheme = useColorScheme();

    const resolvedTheme = (theme: string)=>{
        return theme === 'system'
            ? (systemColorScheme === 'dark' ? 'dark' : 'light')
            : settings.theme;
    }



    const dynamicMarkdownStyles = useMemo(()=>{


        const isDark = resolvedTheme(settings.theme) == 'dark';


        return {
            text: {
                color: isDark ? '#FFFFFF' : '#1a1a1a',
            },
            p: {
                color: isDark ? '#FFFFFF' : '#1a1a1a',
            },
            body: {
                padding: 16,
                fontSize: 15,
                lineHeight: 24,
                color: isDark ? '#1a1a1a': '#E5E5E5',
            },
            heading1: {
                fontSize: 22,
                fontWeight: '700',
                marginTop: 20,
                marginBottom: 12,
                color: isDark ? '#FFFFFF' : '#1a1a1a',
            },
            heading2: {
                fontSize: 20,
                fontWeight: '600',
                marginTop: 16,
                marginBottom: 10,
                color: isDark ? '#FFFFFF' : '#1a1a1a',
            },
            heading3: {
                fontSize: 18,
                fontWeight: '600',
                marginTop: 12,
                marginBottom: 8,
                color: isDark ? '#FFFFFF' : '#1a1a1a',
            },
            code_inline: {
                backgroundColor: isDark ? '#2D2D2D' : '#F5F5F5',
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
                fontFamily: 'Courier',
                fontSize: 14,
                color: isDark ? '#FF6B6B' : '#E53935',
            },
            code_block: {
                backgroundColor: isDark ? '#2D2D2D' : '#F5F5F5',
                padding: 12,
                borderRadius: 8,
                fontFamily: 'Courier',
                fontSize: 13,
                marginVertical: 8,
                color: isDark ? '#E5E5E5' : '#1a1a1a',
            },
            fence: {
                backgroundColor: isDark ? '#2D2D2D' : '#F5F5F5',
                padding: 12,
                borderRadius: 8,
                fontFamily: 'Courier',
                fontSize: 13,
                marginVertical: 8,
                color: isDark ? '#E5E5E5' : '#1a1a1a',
            },
            bullet_list: {
                marginVertical: 8,
            },
            ordered_list: {
                marginVertical: 8,
            },
            list_item: {
                marginVertical: 4,
                color: isDark ? '#E5E5E5' : '#1a1a1a',
            },
            blockquote: {
                backgroundColor: isDark ? '#1E3A5F' : '#F0F8FF',
                borderLeftWidth: 4,
                borderLeftColor: isDark ? '#4A90E2' : '#007AFF',
                paddingVertical: 8,
                paddingHorizontal: 12,
                marginVertical: 8,
            },
            table: {
                borderWidth: 1,
                borderColor: isDark ? '#404040' : '#E0E0E0',
                borderRadius: 8,
                marginVertical: 8,
            },
            tr: {
                borderBottomWidth: 1,
                borderBottomColor: isDark ? '#404040' : '#E0E0E0',
            },
            th: {
                padding: 8,
                backgroundColor: isDark ? '#2D2D2D' : '#F5F5F5',
                fontWeight: '600',
                color: isDark ? '#FFFFFF' : '#1a1a1a',
            },
            td: {
                padding: 8,
                color: isDark ? '#E5E5E5' : '#1a1a1a',
            },
            paragraph: {
                color: isDark ? '#E5E5E5' : '#1a1a1a',
                marginVertical: 4,
            },
            link: {
                color: isDark ? '#4A90E2' : '#007AFF',
            },
            strong: {
                color: isDark ? '#FFFFFF' : '#1a1a1a',
            },
        };
    }, [settings, systemColorScheme])

    return (
        <ScrollView
            style={styles.container}
            className="bg-white dark:bg-gray-900"
        >
            <Markdown style={dynamicMarkdownStyles}>
                {content}
            </Markdown>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});