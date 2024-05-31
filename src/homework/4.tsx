import React, {
  createContext,
  useMemo,
  useState,
  useContext,
  ReactNode,
} from "react";
import noop from "lodash/noop";

type MenuIds = "first" | "second" | "last";
type Menu = { id: MenuIds; title: string };

// Описати тип SelectedMenu
type SelectedMenu = { id: MenuIds };

// Описати тип MenuSelected
type MenuSelected = {
  selectedMenu: SelectedMenu | {};
};

// Описати тип MenuAction
type MenuAction = {
  onSelectedMenu: (menu: SelectedMenu) => void;
};

const MenuSelectedContext = createContext<MenuSelected>({
  selectedMenu: {},
});

const MenuActionContext = createContext<MenuAction>({
  onSelectedMenu: noop,
});

// Описати тип PropsProvider
type PropsProvider = {
  children: ReactNode;
};

function MenuProvider({ children }: PropsProvider) {
  const [selectedMenu, setSelectedMenu] = useState<SelectedMenu | {}>({});

  const menuContextAction = useMemo(
    () => ({
      onSelectedMenu: setSelectedMenu,
    }),
    []
  );

  const menuContextSelected = useMemo(
    () => ({
      selectedMenu,
    }),
    [selectedMenu]
  );

  return (
    <MenuActionContext.Provider value={menuContextAction}>
      <MenuSelectedContext.Provider value={menuContextSelected}>
        {children}
      </MenuSelectedContext.Provider>
    </MenuActionContext.Provider>
  );
}

// Описати тип PropsMenu
type PropsMenu = {
  menus: Menu[];
};

function MenuComponent({ menus }: PropsMenu) {
  const { onSelectedMenu } = useContext(MenuActionContext);
  const { selectedMenu } = useContext(MenuSelectedContext) as MenuSelected;

  return (
    <>
      {menus.map((menu) => (
        <div key={menu.id} onClick={() => onSelectedMenu({ id: menu.id })}>
          {menu.title}{" "}
          {(selectedMenu as SelectedMenu).id === menu.id
            ? "Selected"
            : "Not selected"}
        </div>
      ))}
    </>
  );
}

export function ComponentApp() {
  const menus: Menu[] = [
    {
      id: "first",
      title: "first",
    },
    {
      id: "second",
      title: "second",
    },
    {
      id: "last",
      title: "last",
    },
  ];

  return (
    <MenuProvider>
      <MenuComponent menus={menus} />
    </MenuProvider>
  );
}
