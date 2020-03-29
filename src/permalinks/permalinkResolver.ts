import { IPermalinkResolver } from "./";
import { HyperlinkContract } from "../editing";
import { HyperlinkModel } from "./hyperlinkModel";
import { Contract } from "..";
import { ContentItemContract } from "../contentItems";

export class PermalinkResolver implements IPermalinkResolver {
    constructor(private readonly permalinkResolvers: IPermalinkResolver[]) { }

    public canHandleTarget(targetKey: string): boolean {
        return this.permalinkResolvers.some(x => x.canHandleTarget(targetKey));
    }

    public async getUrlByTargetKey(targetKey: string, locale?: string): Promise<string> {
        if (!targetKey) {
            throw new Error(`Parameter "targetKey" not specified.`);
        }

        const permalinkResolver = this.permalinkResolvers.find(x => x.canHandleTarget(targetKey));
        const targetUrl = await permalinkResolver.getUrlByTargetKey(targetKey, locale);

        return targetUrl;
    }

    public async getHyperlinkFromContract(hyperlinkContract: HyperlinkContract, locale?: string): Promise<HyperlinkModel> {
        let hyperlinkModel: HyperlinkModel;

        const permalinkResolver = this.permalinkResolvers.find(x => x.canHandleTarget(hyperlinkContract.targetKey));

        if (permalinkResolver) {
            hyperlinkModel = await permalinkResolver.getHyperlinkFromContract(hyperlinkContract, locale);

            if (hyperlinkModel) {
                return hyperlinkModel;
            }
        }
        else {
            console.warn(`Could not find permalink resolver for content item with key "${hyperlinkContract.targetKey}"`);
        }

        return this.getEmptyHyperlink();
    }

    public async getHyperlinkByTargetKey(targetKey: string, locale?: string): Promise<HyperlinkModel> {
        const permalinkResolver = this.permalinkResolvers.find(x => x.canHandleTarget(targetKey));

        if (!permalinkResolver) {
            console.warn(`Could not find permalink resolver for content item with key "${targetKey}".`);
            return this.getEmptyHyperlink();
        }

        const hyperlink = await permalinkResolver.getHyperlinkByTargetKey(targetKey, locale);

        return hyperlink || this.getEmptyHyperlink();
    }

    public async getContentByPermalink(permalink: string, locale?: string): Promise<Contract> {
        for (const permalinkResolver of this.permalinkResolvers) {
            if (!permalinkResolver.getContentByPermalink) {
                continue;
            }

            const contentItem = await permalinkResolver?.getContentByPermalink(permalink, locale);

            if (contentItem) {
                return contentItem;
            }
        }

        return null;
    }

    public async getContentItemByPermalink(permalink: string, locale?: string): Promise<ContentItemContract> {
        for (const permalinkResolver of this.permalinkResolvers) {
            if (!permalinkResolver.getContentItemByPermalink) {
                continue;
            }

            const contentItem = await permalinkResolver?.getContentItemByPermalink(permalink, locale);

            if (contentItem) {
                return contentItem;
            }
        }

        return null;
    }

    public getEmptyHyperlink(): HyperlinkModel {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = "Unset link";
        hyperlinkModel.target = "_self";
        hyperlinkModel.targetKey = null;
        hyperlinkModel.href = "#";
        hyperlinkModel.anchor = null;
        return hyperlinkModel;
    }
}