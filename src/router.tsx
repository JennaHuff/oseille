import { Navigate, createBrowserRouter } from 'react-router-dom';
import App from './App';
import { AboutPage } from './page/about/AboutPage';
import { AppSection } from './page/about/sections/app-section/AppSection';
import { BusinessSection } from './page/about/sections/business-section/BusinessSection';
import { TeamSection } from './page/about/sections/team-section/TeamSection';
import { BackOfficePage } from './page/back-office/BackOfficePage';
import { CustomerAll } from './page/customer/CustomerAll';
import { CustomerPage } from './page/customer/CustomerPage';
import { CustomerDetail } from './page/customer/detail/CustomerDetail';
import { CustomerCreateModal } from './page/customer/modal/CustomerCreateModal';
import { CustomerEditModal } from './page/customer/modal/CustomerEditModal';
import { DashboardPage } from './page/dashboard/DashboardPage';
import { DeliveryAll } from './page/delivery/DeliveryAll';
import { DeliveryDetail } from './page/delivery/DeliveryDetail';
import { DeliveryPage } from './page/delivery/DeliveryPage';
import { OrderAll } from './page/delivery/OrderAll';
import { OrderPage } from './page/delivery/OrderPage';
import { DeliveryCreateModal } from './page/delivery/modal/DeliveryCreateModal';
import { DeliveryEditModal } from './page/delivery/modal/DeliveryEditModal';
import { InvoiceAll } from './page/invoice/InvoiceAll';
import { InvoiceDetail } from './page/invoice/InvoiceDetail';
import { InvoicePage } from './page/invoice/InvoicePage';
import { InvoiceEditModal } from './page/invoice/modal/InvoiceEditModal';
import { PricePage } from './page/prices/PricePage';
import { ProductAll } from './page/product/ProductAll';
import { ProductDetail } from './page/product/ProductDetail';
import { ProductPage } from './page/product/ProductPage';
import { ProductCreateModal } from './page/product/modal/ProductCreateModal';
import { ProductEditModal } from './page/product/modal/ProductEditModal';
import { SettingPage } from './page/settings/SettingPage';
import { AdvancedSection } from './page/settings/sections/advanced-section/AdvancedSection';
import { FarmSection } from './page/settings/sections/farm-section/FarmSection';
import { InvoiceSection } from './page/settings/sections/invoice-section/InvoiceSection';

const visitDefault = (route: string) => {
  return {
    index: true,
    element: (
      <Navigate
        to={route}
        replace
      />
    ),
  };
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <DashboardPage /> },
      {
        path: 'product',
        element: <ProductPage />,
        children: [
          { index: true, element: <ProductAll /> },
          { path: 'create', element: <ProductCreateModal /> },
          { path: ':id', element: <ProductDetail />, children: [{ path: 'edit', element: <ProductEditModal /> }] },
        ],
      },
      {
        path: 'customer',
        element: <CustomerPage />,
        children: [
          { index: true, element: <CustomerAll /> },
          { path: 'create', element: <CustomerCreateModal /> },
          { path: ':id', element: <CustomerDetail />, children: [{ path: 'edit', element: <CustomerEditModal /> }] },
        ],
      },
      { path: 'prices', element: <PricePage /> },
      {
        path: 'order',
        element: <OrderPage />,
        children: [
          { index: true, element: <OrderAll /> },
          { path: 'create', element: <DeliveryCreateModal /> },
          { path: ':id', element: <DeliveryDetail />, children: [{ path: 'edit', element: <DeliveryEditModal /> }] },
        ],
      },
      {
        path: 'delivery',
        element: <DeliveryPage />,
        children: [
          { index: true, element: <DeliveryAll /> },
          { path: 'create', element: <DeliveryCreateModal /> },
          { path: ':id', element: <DeliveryDetail />, children: [{ path: 'edit', element: <DeliveryEditModal /> }] },
        ],
      },
      {
        path: 'invoice',
        element: <InvoicePage />,
        children: [
          { index: true, element: <InvoiceAll /> },
          { path: ':id', element: <InvoiceDetail />, children: [{ path: 'edit', element: <InvoiceEditModal /> }] },
        ],
      },
      {
        path: 'settings',
        element: <SettingPage />,
        children: [
          visitDefault('farm'),
          { path: 'farm', element: <FarmSection /> },
          { path: 'invoices', element: <InvoiceSection /> },
          { path: 'advanced', element: <AdvancedSection /> },
        ],
      },
      {
        path: 'about',
        element: <AboutPage />,
        children: [
          visitDefault('app'),
          { path: 'app', element: <AppSection /> },
          { path: 'team', element: <TeamSection /> },
          { path: 'business', element: <BusinessSection /> },
        ],
      },
      { path: 'admin', element: <BackOfficePage /> },
    ],
  },
]);
