import type { ComponentProps, FC } from 'react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BottomNavigation as BottomNavigationPaper,
  useTheme,
} from 'react-native-paper';

import MainSettingsScreen from '@/views/navigation/screens/MainSettingsScreen';
import LivedataTab from '@/views/navigation/tabs/LivedataTab';

const LivedataRoute = () => <LivedataTab />;

const SettingsRoute = () => <MainSettingsScreen />;

type BaseRoutes = ComponentProps<
  typeof BottomNavigationPaper
>['navigationState']['routes'];

const BottomNavigation: FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [index, setIndex] = useState<number>(0);

  /*const [routes] = useState<BaseRoutes>([
    {
      key: 'livedata',
      title: 'Livedata',
      focusedIcon: 'solar-power',
    },
    {
      key: 'settings',
      title: 'Settings',
      focusedIcon: 'cog',
    },
  ]);*/

  const routes = useMemo<BaseRoutes>(
    () => [
      {
        key: 'livedata',
        title: t('navigation.livedata'),
        focusedIcon: 'solar-power',
      },
      {
        key: 'settings',
        title: t('navigation.settings'),
        focusedIcon: 'cog',
      },
    ],
    [t],
  );

  const renderScene = BottomNavigationPaper.SceneMap({
    livedata: LivedataRoute,
    settings: SettingsRoute,
  });

  return (
    <BottomNavigationPaper
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      barStyle={{ backgroundColor: theme.colors.surface }}
    />
  );
};

export default BottomNavigation;
