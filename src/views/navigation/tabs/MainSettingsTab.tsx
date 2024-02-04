import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import packageJson from '@root/package.json';

import type { FC } from 'react';
import { useMemo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { Box } from 'react-native-flex-layout';
import { Badge, List, Text, useTheme } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import { setDebugEnabled } from '@/slices/settings';

import ChangeLanguageModal from '@/components/modals/ChangeLanguageModal';
import ChangeThemeModal from '@/components/modals/ChangeThemeModal';

import useDtuState from '@/hooks/useDtuState';
import useHasNewAppVersion from '@/hooks/useHasNewAppVersion';
import useIsConnected from '@/hooks/useIsConnected';
import useRequireMultiplePresses from '@/hooks/useRequireMultiplePresses';
import useSettings from '@/hooks/useSettings';

import { StyledSafeAreaView } from '@/style';

const MainSettingsTab: FC = () => {
  const navigation = useNavigation() as NavigationProp<ParamListBase>;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const theme = useTheme();

  const [showChangeThemeModal, setShowChangeThemeModal] =
    useState<boolean>(false);

  const openChangeThemeModal = () => setShowChangeThemeModal(true);
  const closeChangeThemeModal = () => setShowChangeThemeModal(false);

  const [showChangeLanguageModal, setShowChangeLanguageModal] =
    useState<boolean>(false);

  const openChangeLanguageModal = () => setShowChangeLanguageModal(true);
  const closeChangeLanguageModal = () => setShowChangeLanguageModal(false);

  const websocketConnected = useIsConnected();
  const [hasNewAppVersion] = useHasNewAppVersion({
    usedForIndicatorOnly: true,
  });

  const showDebugScreen = useSettings(state => state?.debugEnabled);

  const hasSystemInformation = !!useDtuState(state => !!state?.systemStatus);
  const hasNetworkInformation = !!useDtuState(state => !!state?.networkStatus);
  const hasNtpInformation = !!useDtuState(state => !!state?.ntpStatus);
  const hasMqttInformation = !!useDtuState(state => !!state?.mqttStatus);

  const systemInformationDisabled = useMemo(
    () => !hasSystemInformation || !websocketConnected,
    [hasSystemInformation, websocketConnected],
  );
  const networkInformationDisabled = useMemo(
    () => !hasNetworkInformation || !websocketConnected,
    [hasNetworkInformation, websocketConnected],
  );
  const ntpInformationDisabled = useMemo(
    () => !hasNtpInformation || !websocketConnected,
    [hasNtpInformation, websocketConnected],
  );
  const mqttInformationDisabled = useMemo(
    () => !hasMqttInformation || !websocketConnected,
    [hasMqttInformation, websocketConnected],
  );

  const handleAbout = useCallback(() => {
    navigation.navigate('AboutSettingsScreen');
  }, [navigation]);

  const handleAboutOpenDTU = useCallback(() => {
    navigation.navigate('AboutOpenDTUScreen');
  }, [navigation]);

  const handleLicenses = useCallback(() => {
    navigation.navigate('LicensesScreen');
  }, [navigation]);

  const handleNetworkInformation = useCallback(() => {
    navigation.navigate('NetworkInformationScreen');
  }, [navigation]);

  const handleNtpInformation = useCallback(() => {
    navigation.navigate('NtpInformationScreen');
  }, [navigation]);

  const handleMqttInformation = useCallback(() => {
    navigation.navigate('MqttInformationScreen');
  }, [navigation]);

  const handleDebugScreen = useCallback(() => {
    navigation.navigate('DebugScreen');
  }, [navigation]);

  const enableDebugMode = useCallback(() => {
    dispatch(setDebugEnabled({ debugEnabled: true }));
  }, [dispatch]);
  const handleUnlockDebug = useRequireMultiplePresses(enableDebugMode);

  return (
    <StyledSafeAreaView theme={theme}>
      <Box style={{ width: '100%', flex: 1 }}>
        <ScrollView>
          <List.Section>
            <List.Subheader>{t('opendtu.title')}</List.Subheader>
            <List.Item
              title={t('opendtu.systemInformation')}
              description={t('opendtu.systemInformationDescription')}
              left={props => <List.Icon {...props} icon="information" />}
              onPress={handleAboutOpenDTU}
              disabled={systemInformationDisabled}
              style={{ opacity: systemInformationDisabled ? 0.5 : 1 }}
            />
            <List.Item
              title={t('opendtu.networkInformation')}
              description={t('opendtu.networkInformationDescription')}
              left={props => <List.Icon {...props} icon="wifi" />}
              onPress={handleNetworkInformation}
              disabled={networkInformationDisabled}
              style={{ opacity: networkInformationDisabled ? 0.5 : 1 }}
            />
            <List.Item
              title={t('opendtu.ntpInformation')}
              description={t('opendtu.ntpInformationDescription')}
              left={props => <List.Icon {...props} icon="clock" />}
              onPress={handleNtpInformation}
              disabled={ntpInformationDisabled}
              style={{ opacity: ntpInformationDisabled ? 0.5 : 1 }}
            />
            <List.Item
              title={t('opendtu.mqttInformation')}
              description={t('opendtu.mqttInformationDescription')}
              left={props => <List.Icon {...props} icon="broadcast" />}
              onPress={handleMqttInformation}
              disabled={mqttInformationDisabled}
              style={{ opacity: mqttInformationDisabled ? 0.5 : 1 }}
            />
          </List.Section>
          <List.Section>
            <List.Subheader>{t('settings.general')}</List.Subheader>
            <List.Item
              title={t('settings.theme')}
              description={t('settings.themeDescription')}
              left={props => <List.Icon {...props} icon="theme-light-dark" />}
              onPress={openChangeThemeModal}
            />
            <List.Item
              title={t('settings.language')}
              description={t('settings.languageDescription')}
              left={props => <List.Icon {...props} icon="translate" />}
              onPress={openChangeLanguageModal}
            />
            <List.Item
              title={t('settings.aboutApp')}
              description={t('settings.aboutDescription')}
              left={props => <List.Icon {...props} icon="information" />}
              right={props =>
                hasNewAppVersion ? (
                  <Badge visible={true} style={{ marginTop: 8 }} {...props}>
                    {t('settings.newAppRelease')}
                  </Badge>
                ) : null
              }
              onPress={handleAbout}
            />
            <List.Item
              title={t('settings.licenses')}
              description={t('settings.licensesDescription')}
              left={props => <List.Icon {...props} icon="file-document" />}
              onPress={handleLicenses}
            />
            {showDebugScreen ? (
              <List.Item
                title={t('settings.debug')}
                left={props => <List.Icon {...props} icon="bug" />}
                onPress={handleDebugScreen}
              />
            ) : null}
          </List.Section>
          <Text style={{ textAlign: 'center' }} onPress={handleUnlockDebug}>
            Version {packageJson.version}
          </Text>
        </ScrollView>
      </Box>
      <ChangeThemeModal
        visible={showChangeThemeModal}
        onDismiss={closeChangeThemeModal}
      />
      <ChangeLanguageModal
        visible={showChangeLanguageModal}
        onDismiss={closeChangeLanguageModal}
      />
    </StyledSafeAreaView>
  );
};

export default MainSettingsTab;
