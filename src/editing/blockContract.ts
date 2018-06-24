import { InlineContract } from "./inlineContract";
import { Contract } from "@paperbits/common/contract";

export interface TypographyContract {
    font?: string;
    size?: string;
}

export interface AlignmentContract {
    xl?: string;
    lg?: string;
    md?: string;
    sm?: string;
    xs?: string;
}

export interface BlockContract extends Contract {
    nodes?: BlockContract[];
    leaves?: InlineContract[];
    anchorKey?: string;
    anchorHash?: string;
    alignment?: AlignmentContract;
    typography?: TypographyContract
}

export interface HyperlinkContract extends InlineContract {
    permalinkKey: string;
    target: string;
}
