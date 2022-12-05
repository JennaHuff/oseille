import * as pdfMake from 'pdfmake/build/pdfmake';
import { Product } from '../entity/product';
import { store } from './store';
import { priceFormatter } from '../../utils/formatter';

const fonts = {
  Roboto: {
    normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
    italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
    bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
  },
};

const titles = {
  Delivery: 'Bon de livraison',
  Invoice: 'Facture',
};

export type DocumentKey = 'Delivery' | 'Invoice';

export const exportDocument = ({ payload }: any) => {
  const title = titles[payload.type as DocumentKey] || '';
  const docDefinition: any = {
    defaultStyle: {
      font: 'Roboto',
    },
    footer: { text: store.farm?.footer, alignment: 'center' },
    content: [
      { text: `${title} - ${payload.documentId}`, style: 'header' },
      {
        layout: 'noBorders',
        style: 'tableExample',
        table: {
          widths: ['*', '*'],
          body: [[store.farm?.title || 'La ferme sans nom', { text: payload.customer.name, alignment: 'right' }]],
        },
      },

      {
        layout: 'lightHorizontalLines',
        style: 'tableExample',
        table: {
          headerRows: 1,
          widths: ['*', '*', '*', '*', '*'],
          body: [
            [
              'Designation',

              { text: 'Quantite', alignment: 'right' },
              { text: '' },
              { text: 'Prix unitaire', alignment: 'right' },
              {
                text: 'Montant',
                alignment: 'right',
              },
            ],
            ...payload.products.map((el: { product: Product; quantity: number }) => {
              return [
                el.product.name,

                {
                  text: el.quantity,
                  alignment: 'right',
                },
                {
                  text: el.product.unit,
                  alignment: 'left',
                },{ text: priceFormatter(el.product.price), alignment: 'right' },
                { text: priceFormatter(el.product.price * el.quantity), alignment: 'right' },
              ];
            }),
          ],
        },
      },
      {
        text: `Total       ${priceFormatter(
          payload.products.reduce(
            (acc: number, el: { product: Product; quantity: number }) => acc + el.product.price * el.quantity,
            0,
          ),
        )}`,
        alignment: 'right',
      },
      { qr: payload._id, fit: '80' },
      ...(payload.type === 'Invoice' ? [{ text: 'Livraisons liees', alignment: 'right' }] : []),
      ...(payload.deliveryDocumentIds
        ? payload.deliveryDocumentIds?.map((text: string) => ({
            text,
            alignment: 'right',
          }))
        : []),
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      tableExample: {
        margin: [0, 5, 0, 15],
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black',
      },
    },
  };

  pdfMake.createPdf(docDefinition, undefined, fonts).open();
};
