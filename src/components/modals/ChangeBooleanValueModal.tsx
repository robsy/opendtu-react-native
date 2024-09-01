import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { BottomDrawerMethods } from 'react-native-animated-bottom-drawer';
import BottomDrawer from 'react-native-animated-bottom-drawer';
import type { SwitchProps } from 'react-native-paper';
import { Button, Switch, Text, useTheme } from 'react-native-paper';

import { View } from 'react-native';

export interface ChangeValueModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  defaultValue?: boolean;
  onChange?: (value: boolean) => void;
  title?: string;
  description?: string;
  extraHeight?: number;
  inputProps?: Omit<SwitchProps, 'value' | 'onValueChange'>;
}

const ChangeTextValueModal: FC<ChangeValueModalProps> = ({
  isOpen,
  title,
  description,
  defaultValue,
  onChange: onSave,
  onClose,
  inputProps,
  extraHeight,
}) => {
  const theme = useTheme();
  const drawerRef = useRef<BottomDrawerMethods>(null);
  const { t } = useTranslation();

  const height = 180 + (extraHeight ?? 0);

  const [value, setValue] = useState<boolean>(defaultValue ?? false);
  const [wasModified, setWasModified] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      drawerRef.current?.open();
    } else {
      drawerRef.current?.close();
    }
  }, [isOpen]);

  const handleSave = () => {
    onSave?.(value);
    onClose?.();
  };

  const handleCancel = () => {
    if (!isOpen) {
      return;
    }

    setWasModified(false);
    setValue(defaultValue ?? false);
    onClose?.();
  };

  useEffect(() => {
    if (!wasModified) {
      setValue(defaultValue ?? false);
    }
  }, [defaultValue, wasModified]);

  return (
    <BottomDrawer
      ref={drawerRef}
      overDrag
      customStyles={{
        container: {
          backgroundColor: theme.colors.surface,
        },
        handleContainer: {
          backgroundColor: theme.colors.surfaceVariant,
          minHeight: 35,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          marginBottom: 16,
        },
        handle: {
          backgroundColor: theme.colors.surfaceDisabled,
          width: 40,
          height: 5,
          borderRadius: 5,
        },
      }}
      initialHeight={height}
      onClose={handleCancel}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 14,
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text variant="titleLarge">{title}</Text>
            <Text variant="bodyMedium">{description}</Text>
          </View>
          <View>
            <Switch
              value={value}
              onValueChange={value => {
                setWasModified(true);
                setValue(value);
              }}
              {...inputProps}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 8,
            marginTop: 24,
          }}
        >
          <Button mode="text" onPress={handleCancel} style={{ flex: 1 }}>
            {t('cancel')}
          </Button>
          <Button mode="contained" onPress={handleSave} style={{ flex: 1 }}>
            {t('save')}
          </Button>
        </View>
      </View>
    </BottomDrawer>
  );
};

export default ChangeTextValueModal;