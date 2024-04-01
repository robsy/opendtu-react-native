import type { FC } from 'react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from 'react-native-flex-layout';
import type { ModalProps } from 'react-native-paper';
import { Button, Portal, RadioButton, Text } from 'react-native-paper';

import { setAppTheme } from '@/slices/settings';

import type { SettingsState } from '@/types/settings';

import BaseModal from '@/components/BaseModal';

import { useAppDispatch, useAppSelector } from '@/store';

const ChangeThemeModal: FC<Omit<ModalProps, 'children'>> = props => {
  const { onDismiss } = props;
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const appTheme = useAppSelector(state => state.settings.appTheme);

  const [selectedTheme, setSelectedTheme] =
    useState<SettingsState['appTheme']>(appTheme);

  const handleAbort = useCallback(() => {
    onDismiss?.();
  }, [onDismiss]);

  const handleChangeTheme = useCallback(() => {
    dispatch(setAppTheme({ appTheme: selectedTheme }));
    onDismiss?.();
  }, [dispatch, onDismiss, selectedTheme]);

  return (
    <Portal>
      <BaseModal {...props}>
        <Box p={16}>
          <Box mb={8}>
            <Text variant="bodyLarge">{t('settings.changeTheTheme')}</Text>
          </Box>
          <RadioButton.Group
            value={selectedTheme}
            onValueChange={value =>
              setSelectedTheme(value as SettingsState['appTheme'])
            }
          >
            <RadioButton.Item label={t('themes.light')} value="light" />
            <RadioButton.Item label={t('themes.dark')} value="dark" />
            <RadioButton.Item label={t('themes.system')} value="system" />
          </RadioButton.Group>
          <Box
            mt={16}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Button onPress={handleAbort}>{t('cancel')}</Button>
            <Box ml={8}>
              <Button mode="contained" onPress={handleChangeTheme}>
                {t('change')}
              </Button>
            </Box>
          </Box>
        </Box>
      </BaseModal>
    </Portal>
  );
};

export default ChangeThemeModal;
