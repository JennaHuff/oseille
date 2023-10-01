import { Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import { store } from '../../backend';
import { EditButton } from '../../component/buttons';
import { MyHeader } from '../../component/layout/page-layout/MyHeader';
import { MyH1 } from '../../component/typography/MyFont';
import { TVAFormatter } from '../../utils/formatter';
import { useFarmParameters } from '../../utils/hooks/useFarmParameters';

export const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const snap = useSnapshot(store);
  const { isTVA } = useFarmParameters();

  const selected = useMemo(() => (id ? store.products.find((p) => p.id === id) : undefined), [id, snap]);

  return (
    <>
      {selected && (
        <Box>
          <MyHeader>
            <MyH1>Détail</MyH1>
            <EditButton onClick={() => navigate(`/product/${selected.id}/edit`)} />
            <Outlet />
          </MyHeader>
          <Box>
            <Box>
              {selected.name} /{selected.unit}
            </Box>
            {isTVA && <Box>TVA: {TVAFormatter(selected.tva)}</Box>}
          </Box>
        </Box>
      )}
    </>
  );
};
