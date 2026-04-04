"use client";
/*
 * Documentation:
 * Button — https://app.subframe.com/035ca19f2294/library?component=Button_3b777358-b86b-40af-9327-891efc6826fe
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import * as SubframeUtils from "../utils";

interface ButtonRootProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  variant?:
    | "brand-primary"
    | "white"
    | "brand-tertiary"
    | "neutral-primary"
    | "neutral-secondary"
    | "destructive-primary"
    | "destructive-secondary";
  size?: "medium" | "small";
  children?: React.ReactNode;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const ButtonRoot = React.forwardRef<HTMLButtonElement, ButtonRootProps>(
  function ButtonRoot(
    {
      disabled = false,
      variant = "brand-primary",
      size = "medium",
      children,
      icon = null,
      iconRight = null,
      loading = false,
      className,
      type = "button",
      ...otherProps
    }: ButtonRootProps,
    ref
  ) {
    return (
      <button
        className={SubframeUtils.twClassNames(
          "group/3b777358 flex cursor-pointer items-start gap-2 overflow-hidden border-none bg-brand-primary text-left transition duration-400 ease-out hover:relative hover:disabled:cursor-default hover:disabled:bg-transparent",
          { "bg-transparent": variant === "brand-tertiary" },
          className
        )}
        ref={ref}
        type={type}
        disabled={disabled}
        {...otherProps}
      >
        <div
          className={SubframeUtils.twClassNames(
            "flex h-16 items-center justify-center gap-4 px-8 relative z-10 group-disabled/3b777358:bg-neutral-200",
            {
              "h-12 w-auto flex-none flex-row flex-nowrap gap-1 px-4 py-0":
                size === "small",
              "bg-error-50 group-hover/3b777358:bg-transparent group-active/3b777358:bg-error-50":
                variant === "destructive-secondary",
              "bg-error-600 group-hover/3b777358:bg-transparent group-active/3b777358:bg-error-600":
                variant === "destructive-primary",
              "border border-solid border-neutral-border bg-default-background group-hover/3b777358:bg-neutral-50 group-active/3b777358:bg-default-background":
                variant === "neutral-secondary",
              "bg-neutral-100 group-hover/3b777358:bg-transparent group-active/3b777358:bg-neutral-100":
                variant === "neutral-primary",
              "group-active/3b777358:bg-[#dbeafe]":
                variant === "brand-tertiary",
              "bg-white group-hover/3b777358:bg-transparent group-active/3b777358:bg-[#eff6ff]":
                variant === "white",
            }
          )}
        >
          {icon ? (
            <SubframeCore.IconWrapper
              className={SubframeUtils.twClassNames(
                "text-body-default font-body-default text-default-font group-hover/3b777358:text-white group-disabled/3b777358:text-neutral-400",
                {
                  hidden: loading,
                  "text-error-700": variant === "destructive-secondary",
                  "text-neutral-700":
                    variant === "neutral-secondary" ||
                    variant === "neutral-primary",
                  "text-[#1d4ed8]": variant === "brand-tertiary",
                }
              )}
            >
              {icon}
            </SubframeCore.IconWrapper>
          ) : null}
          <div
            className={SubframeUtils.twClassNames(
              "hidden h-4 w-4 flex-none items-center justify-center gap-2",
              { flex: loading, "h-3 w-3 flex-none": size === "small" }
            )}
          >
            <SubframeCore.Loader
              className={SubframeUtils.twClassNames(
                "font-['Inter'] text-[12px] font-[400] leading-[20px] text-white group-disabled/3b777358:text-neutral-400",
                {
                  "text-caption font-caption": size === "small",
                  "text-error-700": variant === "destructive-secondary",
                  "text-neutral-700":
                    variant === "neutral-secondary" ||
                    variant === "neutral-primary",
                  "text-[#1d4ed8]": variant === "brand-tertiary",
                  "text-default-font": variant === "white",
                }
              )}
            />
          </div>
          <div className="flex items-center justify-center gap-4 pt-1">
            {children ? (
              <span
                className={SubframeUtils.twClassNames(
                  "whitespace-nowrap font-['Back_Issues_BB'] text-[24px] font-[400] leading-[20px] text-default-font group-hover/3b777358:text-white group-disabled/3b777358:text-neutral-400 group-hover/3b777358:group-disabled/3b777358:text-neutral-400",
                  {
                    hidden: loading,
                    "text-caption-bold font-caption-bold": size === "small",
                    "text-error-700": variant === "destructive-secondary",
                    "text-white": variant === "destructive-primary",
                    "text-neutral-700":
                      variant === "neutral-secondary" ||
                      variant === "neutral-primary",
                    "text-[#1d4ed8]": variant === "brand-tertiary",
                  }
                )}
              >
                {children}
              </span>
            ) : null}
          </div>
          {iconRight ? (
            <SubframeCore.IconWrapper
              className={SubframeUtils.twClassNames(
                "text-heading-2 font-heading-2 text-default-font group-hover/3b777358:text-white group-disabled/3b777358:text-neutral-400",
                {
                  "text-error-700": variant === "destructive-secondary",
                  "text-neutral-700":
                    variant === "neutral-secondary" ||
                    variant === "neutral-primary",
                  "text-[#1d4ed8]": variant === "brand-tertiary",
                }
              )}
            >
              {iconRight}
            </SubframeCore.IconWrapper>
          ) : null}
        </div>
        <div
          className={SubframeUtils.twClassNames(
            "flex h-0 grow shrink-0 basis-0 flex-col items-start gap-2 bg-background-dark-primary absolute inset-x-0 bottom-0 transition duration-400 ease-out scale-y-0 origin-bottom group-hover/3b777358:h-20 group-hover/3b777358:grow group-hover/3b777358:shrink-0 group-hover/3b777358:basis-0 group-hover/3b777358:scale-y-100",
            {
              "group-hover/3b777358:bg-error-600":
                variant === "destructive-secondary",
              "group-hover/3b777358:bg-error-700":
                variant === "destructive-primary",
              "group-hover/3b777358:bg-neutral-800":
                variant === "neutral-primary",
              "group-hover/3b777358:bg-system-blue-light":
                variant === "brand-tertiary",
            }
          )}
        />
      </button>
    );
  }
);

export const Button = ButtonRoot;
