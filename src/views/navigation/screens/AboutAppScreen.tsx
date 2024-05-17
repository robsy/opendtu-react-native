import packageJson from '@root/package.json';

import type { FC } from 'react';
import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, ScrollView, Text as RNText } from 'react-native';
import { Box } from 'react-native-flex-layout';
import Markdown from 'react-native-markdown-display';
import type { RenderRules } from 'react-native-markdown-display';
import {
  Appbar,
  Badge,
  Button,
  Divider,
  List,
  Surface,
  Switch,
  Text,
  useTheme,
} from 'react-native-paper';

import { setEnableAppUpdates } from '@/slices/settings';

import useHasNewAppVersion from '@/hooks/useHasNewAppVersion';

import { useAppDispatch, useAppSelector } from '@/store';
import { StyledSafeAreaView } from '@/style';
import type { PropsWithNavigation } from '@/views/navigation/NavigationStack';
import GenericRefreshModal from '@/components/modals/GenericRefreshModal';
import { useFetchControl } from '@/github/FetchHandler';

import moment from 'moment';

const rules: RenderRules = {
  link: (node, children) => <RNText key={node.key}>{children}</RNText>,
};

const AboutAppScreen: FC<PropsWithNavigation> = ({ navigation }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { refreshAppReleases } = useFetchControl();

  const [hasNewAppVersion, releaseInfo, releaseFetchTime] =
    useHasNewAppVersion();

  const prettyTagName = useMemo(() => {
    if (!releaseInfo?.tag_name) {
      return '';
    }

    return releaseInfo.tag_name.replace(/^v/, '');
  }, [releaseInfo]);

  const formattedReleaseFetchTime = useMemo(() => {
    if (!releaseFetchTime) {
      return '';
    }

    return moment(releaseFetchTime).fromNow();
  }, [releaseFetchTime]);

  const inAppUpdatesEnabled = useAppSelector(
    state => state.settings.enableAppUpdates,
  );

  const handleToggleInAppUpdates = useCallback(() => {
    dispatch(setEnableAppUpdates({ enable: !inAppUpdatesEnabled }));
  }, [dispatch, inAppUpdatesEnabled]);

  const handleRefreshRelease = useCallback(() => {
    refreshAppReleases(true);
  }, [refreshAppReleases]);

  const [showRefreshModal, setShowRefreshModal] = useState<boolean>(false);

  const handleShowRefreshModal = useCallback(() => {
    setShowRefreshModal(true);
  }, []);

  const handleHideRefreshModal = useCallback(() => {
    setShowRefreshModal(false);
  }, []);

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={t('settings.aboutApp')} />
        <Appbar.Action icon="refresh" onPress={handleShowRefreshModal} />
      </Appbar.Header>
      <StyledSafeAreaView theme={theme}>
        <GenericRefreshModal
          visible={showRefreshModal}
          onDismiss={handleHideRefreshModal}
          onConfirm={handleRefreshRelease}
          title={t('aboutApp.refreshModal.title')}
          warningText={t('aboutApp.refreshModal.warningText')}
        />
        <Box style={{ width: '100%', flex: 1 }}>
          <ScrollView>
            <Box>
              <Text style={{ textAlign: 'center' }} variant="titleLarge">
                {packageJson.name} {packageJson.version}
              </Text>
              <Box p={8}>
                <Text style={{ textAlign: 'center' }}>
                  {t('aboutApp.projectHint')}
                </Text>
                <Box mt={16} mb={8}>
                  <Button
                    buttonColor="#24292e"
                    textColor="#ffffff"
                    icon="github"
                    onPress={() => Linking.openURL(packageJson.repository.url)}
                  >
                    {t('aboutApp.viewOnGithub')}
                  </Button>
                </Box>
              </Box>
            </Box>
            <Divider />
            <Box p={8}>
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 4,
                }}
              >
                <Text variant="titleLarge" style={{ textAlign: 'center' }}>
                  {hasNewAppVersion
                    ? t('aboutApp.newVersionAvailable')
                    : t('aboutApp.latestAppRelease')}
                </Text>
                <Badge style={{ alignSelf: 'center' }}>{prettyTagName}</Badge>
              </Box>
              <Box>
                <Text variant="bodySmall" style={{ textAlign: 'center' }}>
                  {t('fetchedWithTime', { time: formattedReleaseFetchTime })}
                </Text>
              </Box>
              <Surface style={{ padding: 8, marginTop: 8, borderRadius: 8 }}>
                <Markdown
                  style={{ link: { textDecorationLine: 'none' } }}
                  rules={rules}
                >
                  {releaseInfo?.body || ''}
                </Markdown>
              </Surface>
              <Box mt={16} mb={8}>
                <Button
                  buttonColor="#24292e"
                  textColor="#ffffff"
                  icon="github"
                  onPress={() => Linking.openURL(releaseInfo?.html_url || '')}
                  disabled={!releaseInfo?.html_url}
                >
                  {t('aboutApp.viewMore')}
                </Button>
              </Box>
            </Box>
            <Divider />
            <List.Item
              title={t('settings.activateInappUpdates')}
              right={props => (
                <Switch
                  {...props}
                  value={!!inAppUpdatesEnabled}
                  onValueChange={handleToggleInAppUpdates}
                  color={theme.colors.primary}
                />
              )}
            />
          </ScrollView>
        </Box>
      </StyledSafeAreaView>
    </>
  );
};

export default AboutAppScreen;
