import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from 'react-native-flex-layout';

import OpenDTUValue from '@/components/OpenDTUValue';
import StatusWidget from '@/components/StatusWidget';

import useLivedata from '@/hooks/useLivedata';

import { spacing } from '@/constants';

const ImportantStatusValues: FC = () => {
  const { t } = useTranslation();
  const yieldToday = useLivedata(state => state?.total.YieldDay);
  const power = useLivedata(state => state?.total.Power);

  return (
    <Box ph={12}>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
          gap: spacing,
        }}
      >
        <StatusWidget title={t('livedata.todaysYield')} icon="solar-panel">
          <OpenDTUValue statusValue={yieldToday} />
        </StatusWidget>
        <StatusWidget title={t('livedata.power')} icon="flash">
          <OpenDTUValue statusValue={power} />
        </StatusWidget>
      </Box>
    </Box>
  );
};

export default ImportantStatusValues;
