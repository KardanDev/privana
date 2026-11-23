"use client";

import type { Route } from "next";
import Link from "next/link";
import {
  type ComponentProps,
  type RefObject,
  useCallback,
  useContext,
  useRef,
} from "react";
import { NavigationGuardContext } from "./navigation-guard-context";

type NextLinkProps = ComponentProps<typeof Link>;
type GuardedLinkProps = Omit<NextLinkProps, "as" | "href" | "onNavigate"> & {
  fallbackFocusRef?: RefObject<HTMLElement | null>;
  href: string;
};

export function GuardedLink({
  fallbackFocusRef,
  href,
  onClick,
  replace,
  scroll,
  transitionTypes,
  ...props
}: GuardedLinkProps) {
  const navigation = useContext(NavigationGuardContext);
  const anchor = useRef<HTMLAnchorElement | null>(null);
  const route = href as Route;
  const handleClick = useCallback<NonNullable<NextLinkProps["onClick"]>>(
    (event) => {
      anchor.current = event.currentTarget;
      onClick?.(event);
    },
    [onClick]
  );
  const handleNavigate = useCallback<NonNullable<NextLinkProps["onNavigate"]>>(
    (event) => {
      const guard = navigation?.guard.current;
      if (!(guard && navigation)) {
        return;
      }
      const destination = new URL(route, window.location.href);
      if (destination.origin !== window.location.origin) {
        return;
      }
      const trigger = anchor.current;
      const restoreFocus = () => {
        const target = fallbackFocusRef?.current ?? trigger;
        if (target?.isConnected) {
          target.focus({ preventScroll: true });
        }
      };
      const proceed = () => {
        navigation.router[replace ? "replace" : "push"](route, {
          scroll,
          transitionTypes,
        });
      };
      if (guard(destination, proceed, restoreFocus)) {
        event.preventDefault();
      }
    },
    [fallbackFocusRef, navigation, replace, route, scroll, transitionTypes]
  );
  return (
    <Link
      {...props}
      href={route}
      onClick={handleClick}
      onNavigate={handleNavigate}
      replace={replace}
      scroll={scroll}
      transitionTypes={transitionTypes}
    />
  );
}
