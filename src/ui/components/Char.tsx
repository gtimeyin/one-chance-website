// @subframe/sync-disable
"use client";
/*
 * Documentation:
 * Char — https://app.subframe.com/035ca19f2294/library?component=Char_e6a799b5-3ed5-499c-ba2d-c5c32cfce2a3
 */

import React from "react";
import * as SubframeUtils from "../utils";

interface CharRootProps extends React.HTMLAttributes<HTMLDivElement> {
  image?: string;
  className?: string;
}

const CharRoot = React.forwardRef<HTMLDivElement, CharRootProps>(
  function CharRoot({ image, className, ...otherProps }: CharRootProps, ref) {
    return (
      <div
        className={SubframeUtils.twClassNames(
          "flex h-full w-full items-end relative overflow-visible",
          className
        )}
        ref={ref}
        {...otherProps}
      >
        {image ? (
          <img
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[75%] w-auto max-w-none object-contain object-bottom"
            src={image}
          />
        ) : null}
      </div>
    );
  }
);

export const Char = CharRoot;
