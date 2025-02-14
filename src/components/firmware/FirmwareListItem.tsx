import type { FC } from 'react';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge, Divider, List, Text, useTheme } from 'react-native-paper';

import { Linking, View } from 'react-native';

import { compare } from 'compare-versions';
import moment from 'moment/moment';

import ReleaseChangelog from '@/components/ReleaseChangelog';
import SettingsSurface, {
  settingsSurfaceRoundness,
} from '@/components/styled/SettingsSurface';

import useAppLanguage from '@/hooks/useAppLanguage';
import useDtuState from '@/hooks/useDtuState';
import useHasAuthConfigured from '@/hooks/useHasAuthConfigured';

import capitalize from '@/utils/capitalize';

import { minimumOpenDtuFirmwareVersion, spacing } from '@/constants';
import type { SupportedLanguage } from '@/translations';

import type { Release } from '@octokit/webhooks-types';

export interface FirmwareListItemProps {
  release: Release;
  selectRelease: (release: Release) => void;
  latestReleaseTag?: string;
}

const needsCapitalization: Record<SupportedLanguage, boolean> = {
  en: false,
  de: true,
};

const FirmwareListItem: FC<FirmwareListItemProps> = ({
  release,
  selectRelease,
  latestReleaseTag,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const installedFirmware = useDtuState(state => state?.systemStatus?.git_hash);

  const authStringConfigured = useHasAuthConfigured();
  const language = useAppLanguage();

  const handleOpenGithub = useCallback(async () => {
    const url = release.html_url;

    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    }
  }, [release.html_url]);

  const handleInstallFirmware = useCallback(() => {
    selectRelease(release);
  }, [selectRelease, release]);

  const isInstalled = release.tag_name === installedFirmware;

  const downloadDisabled = useMemo(
    () => isInstalled || !authStringConfigured,
    [authStringConfigured, isInstalled],
  );

  const description = useMemo(() => {
    const date = moment(release.published_at).format('LLLL');
    const timeAgo = moment(release.published_at).fromNow();
    const capitalized = needsCapitalization[language]
      ? capitalize(timeAgo)
      : timeAgo;
    return `${t('firmwares.publishedAgo', { timeAgo: capitalized })}\n${date}`;
  }, [release.published_at, language, t]);

  const isMinimumRecommendedVersion = useMemo(
    () => compare(release.tag_name, minimumOpenDtuFirmwareVersion, '='),
    [release.tag_name],
  );

  return (
    <List.Accordion
      key={`firmware-${release.id}`}
      title={
        <View
          style={{
            flexDirection: 'row',
            gap: spacing,
          }}
        >
          <Text variant="titleMedium" numberOfLines={1}>
            {release.name}
          </Text>
          {release.tag_name === installedFirmware ? (
            <Badge
              style={{
                alignSelf: 'center',
                backgroundColor: theme.colors.primary,
              }}
            >
              {t('firmwares.installedFirmware')}
            </Badge>
          ) : release.tag_name === latestReleaseTag ? (
            <Badge
              style={{
                alignSelf: 'center',
                backgroundColor: theme.colors.primary,
              }}
            >
              {t('firmwares.latestFirmware')}
            </Badge>
          ) : null}
          {isMinimumRecommendedVersion ? (
            <Badge
              style={{
                alignSelf: 'center',
                backgroundColor: theme.colors.primary,
              }}
            >
              {t('firmwares.recommendedFirmware')}
            </Badge>
          ) : null}
        </View>
      }
      description={description}
    >
      <SettingsSurface style={{ marginHorizontal: 16, flex: 1 }}>
        <View style={{ padding: 8, flex: 1 }}>
          <ReleaseChangelog releaseBody={release.body} />
        </View>
        <Divider />
        <List.Item
          title={t('firmwares.view_on_github')}
          onPress={handleOpenGithub}
          left={props => <List.Icon {...props} icon="github" />}
          borderless
          style={{
            borderBottomLeftRadius: isInstalled
              ? settingsSurfaceRoundness(theme)
              : 0,
            borderBottomRightRadius: isInstalled
              ? settingsSurfaceRoundness(theme)
              : 0,
          }}
        />
        {!isInstalled ? (
          <List.Item
            title={t('firmwares.install_firmware_on_device')}
            onPress={handleInstallFirmware}
            left={props => <List.Icon {...props} icon="download" />}
            borderless
            style={{
              borderBottomLeftRadius: settingsSurfaceRoundness(theme),
              borderBottomRightRadius: settingsSurfaceRoundness(theme),
              opacity: downloadDisabled ? 0.5 : 1,
            }}
            disabled={downloadDisabled}
          />
        ) : null}
      </SettingsSurface>
    </List.Accordion>
  );
};

export default FirmwareListItem;
