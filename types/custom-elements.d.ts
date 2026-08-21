import type * as React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "registration-form-entry": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        configuration?: string;
      };
    }
  }
}
