import { MyH1, MyH2, MyLink, MySubtitle } from '../../component/typography/MyFont';
import { Flex, List, ListIcon, ListItem } from '@chakra-ui/react';
import { CheckIcon, RepeatIcon, TimeIcon } from '@chakra-ui/icons';
import { NavLink } from 'react-router-dom';

type Status = 'todo' | 'doing' | 'done';

const TODO_ITEMS: Array<{ text: string; status: Status }> = [
  { text: 'Gérer une liste de produits avec un prix', status: 'done' },
  { text: 'Gérer une liste de clients', status: 'done' },
  { text: 'Changer les prix des produits facilement', status: 'done' },
  { text: 'Générer un bon de livraison', status: 'done' },
  { text: 'Calcul automatique des lignes de livraison', status: 'done' },
  { text: 'Grouper des bons de livraison en une facture', status: 'done' },
  { text: 'Export .pdf des bons de livraison et des factures', status: 'done' },
  { text: 'Import/Export de capsules temporelles pour protéger la data sur un autre support', status: 'done' },
];

const NEXT: Array<{ text: string; status: Status }> = [
  { text: 'Gérer le status des documents (envoyé, payé)', status: 'todo' },
  { text: 'Suivi des ventes par client et par produit', status: 'todo' },
];

const ROADMAP: Array<{ text: string; status: Status }> = [
  { text: 'Gestion des paniers en click-and-collect personnalisé', status: 'todo' },
  { text: 'Assolement, cahier de culture', status: 'todo' },
];

// TODO add a better typing to keep only Status as key
const statusIcon: { [key: string]: { icon: typeof CheckIcon; color: string } } = {
  done: { icon: CheckIcon, color: 'green.500' },
  doing: { icon: RepeatIcon, color: 'blue.500' },
  todo: { icon: TimeIcon, color: 'yellow.500' },
};
export function Home() {
  return (
    <>
      <div className="catalog">
        <div className="catalog-side">
          <div className="catalog-header">
            <MyH1>Bienvenue sur Oseille</MyH1>
          </div>
          <div className="catalog-list">
            <MySubtitle>L'application qui aide les maraîchers à gérer leur argent, entre autres...</MySubtitle>
            <MySubtitle>Application gratuite, en code libre, et qui marche sans internet</MySubtitle>
            <p>
              <span className="bold">Attention</span> : Cette application est toujours en développement et va connaître
              de gros changements jusqu'à nouvel ordre
            </p>
            <p className="bold">
              Faites régulièrement des exports depuis la page <NavLink to="settings">Réglages</NavLink>.
            </p>

            <Flex gap={4}>
              <MyLink
                href="https://www.facebook.com/maxime.pigeon/"
                target="_blank"
                p={2}
                border={'1px'}
              >
                Facebook
              </MyLink>
              <MyLink
                href="https://www.linkedin.com/in/maxime-pigeon/"
                target="_blank"
                p={2}
                border={'1px'}
              >
                LinkedIn
              </MyLink>
            </Flex>
          </div>
        </div>
        <div className="catalog-side">
          <MyH2>Fonctionnalités :</MyH2>
          <List spacing={3}>
            {TODO_ITEMS.map((item) => (
              <TodoItem
                key={item.text}
                item={item}
              />
            ))}
            <ListItem listStyleType="none">... et ensuite...</ListItem>
            {NEXT.map((item) => (
              <TodoItem
                key={item.text}
                item={item}
              />
            ))}
            <ListItem listStyleType="none">... Plein d'autres choses...</ListItem>
            {ROADMAP.map((item) => (
              <TodoItem
                key={item.text}
                item={item}
              />
            ))}
            <ListItem listStyleType="none">... Dites moi de quoi vous avez besoin.</ListItem>
          </List>
        </div>
      </div>
    </>
  );
}

function TodoItem({ item }: { item: { text: string; status: string } }) {
  return (
    <ListItem>
      <ListIcon
        as={statusIcon[item.status].icon}
        color={statusIcon[item.status].color}
      />
      {item.text}
    </ListItem>
  );
}
