import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { AddressAdapted } from "./scaffold-eth/AddressAdapted";
import { RainbowKitCustomConnectButtonPW } from "./scaffold-eth/RainbowKitCustomConnectButtonPW";
import { AccountSwitcher } from "./wallet/AccountSwitcher/AccountSwitcher";
import { privateKeyToAccount } from "viem/accounts";
import { WalletIcon } from "@heroicons/react/20/solid";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { useSharedState } from "~~/sharedStateContext";

interface HeaderMenuLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Wallet",
    href: "/wallet",
  },
];

export const HeaderMenuLinks = () => {
  const router = useRouter();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = router.pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-secondary shadow-md" : ""
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  const { selectedPrivateKey, isRainbow } = useSharedState();

  let account;

  if (selectedPrivateKey !== "") {
    account = privateKeyToAccount(selectedPrivateKey as `0x${string}`);
  }

  const openModal = (modalName: string) => {
    const modal = document.getElementById(modalName) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    } else {
      console.error("Modal element not found!");
    }
  };

  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2 w-full">
      <div className="navbar-start w-auto lg:w-1/2">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>
        <Link href="/wallet" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-10 h-10">
            <Image alt="SE2 logo" className="cursor-pointer" fill src="/punk.png" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight">Punk Wallet</span>
            <span className="text-xs">Built with SE-2</span>
          </div>
        </Link>
        {/* <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
          <HeaderMenuLinks />
        </ul> */}
      </div>
      <div className="navbar-end flex-grow mr-4">
        <div className="flex flex-row gap-5 items-center">
          {account && !isRainbow && (
            <div className="hidden lg:block">
              <AddressAdapted address={account.address} format="short" />
            </div>
          )}
          {!isRainbow && (
            <button className="btn" onClick={() => openModal("account_switcher")}>
              <WalletIcon className="h-8 w-8" /> Accounts
            </button>
          )}
          <RainbowKitCustomConnectButtonPW />
        </div>
        <AccountSwitcher />
        {/* <FaucetButton /> */}
      </div>
    </div>
  );
};
