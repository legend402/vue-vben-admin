export interface MenuItemProps {
  name: string;
  path: string;
  component: string;
  sort: string;
  parentId: string | undefined;
  children?: MenuItemProps[];
  icon: string | undefined;
  id: string;
}
