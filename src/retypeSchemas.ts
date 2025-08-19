import { z } from "zod";

export const RETYPE_FILENAMES = ["retype.yml", "retype.yaml", "retype.json"];

/**
* Retype project configuration (retype.yml)
* All properties optional. Comments summarize the official docs.
* Generated from version v3.12
*/
export const RetypeConfigSchema = z.object({
    /** Path to input content. Usually ".". */
    input: z.string().optional(),

    /** Path to output folder. Default is ".retype". */
    output: z.string().optional(),

    /** Public site URL used for canonical links and sitemaps. */
    url: z.string().optional(),

    branding: z.object({
        title: z.string().optional()
    }),

    /**
    * If string, sets a custom CNAME value at build. If false, disables writing CNAME.
    * Defaults to writing CNAME when url is a custom domain.
    */
    cname: z.union([z.boolean(), z.string()]).optional(),

    edit: z
        .object({
            /** Repository URL used for "Edit this page" links. */
            repo: z.string().optional(),
            /** Base path within the repo. */
            base: z.string().optional(),
            /** Branch name used in edit links. */
            branch: z.string().optional(),
            /** Override the edit link text. */
            label: z.string().optional()
        })
        .optional(),


    footer: z
        .object({
            /** Footer copyright text. Supports Liquid like {{ year }}. */
            copyright: z.string().optional(),
            /** Optional list of footer links. */
            links: z
                .array(
                    z.object({
                        /** Visible text for the link. */
                        text: z.string().optional(),
                        /** Href for the link. */
                        link: z.string().optional(),
                        /** Optional icon name, emoji, <svg>, or image path. */
                        icon: z.string().optional(),
                        /** Icon position relative to text. Default: "left". */
                        iconAlign: z.enum(["left", "right"]).optional(),
                        /** Link target, for example "_blank". */
                        target: z.string().optional()
                    })
                )
                .optional()
        })
        .optional(),

    generator: z
        .object({
            directoryIndex: z
                .object({
                    /**
                    * Additional index filenames to resolve as index pages, for example ["readme"].
                    */
                    altNames: z.array(z.string()).optional(),
                    /**
                    * If true, write HTML index pages for directories so they can be browsed offline.
                    * When combined with search.preload: true, enables offline browsing.
                    */
                    append: z.boolean().optional(),
                    /** Custom index filename to generate. */
                    name: z.string().optional()
                })
                .optional(),

            /**
            * How to write links: "source" | "relative" | "root".
            * Controls how hrefs are generated from source structure.
            */
            paths: z.enum(["source", "relative", "root"]).optional(),

            /**
            * Recase generated file and folder names.
            * "all" converts everything to lowercase, "none" keeps original case.
            * Default: "all".
            */
            recase: z.enum(["all", "none"]).optional(),

            /**
            * If false, remove or avoid adding trailing slash in generated links.
            * Default: true. Best practice is to keep trailing slash.
            */
            trailingSlash: z.boolean().optional()
        })
        .optional(),

    hub: z
        .object({
            /**
            * PRO. Adds a small link left of the title/logo that points to a central hub.
            * Useful to jump from docs subdomain back to main site.
            */
            link: z.string().optional(),
            /** Tooltip text for the hub link. */
            alt: z.string().optional(),
            /** Link target, for example "_blank". */
            target: z.string().optional()
        })
        .optional(),

    /** Include only these paths when building. Supports the same patterns as exclude. */
    include: z.array(z.string()).optional(),

    /** Top header links list. Same structure as footer.links. */
    links: z
        .array(
            z.object({
                text: z.string().optional(),
                link: z.string().optional(),
                icon: z.string().optional(),
                iconAlign: z.enum(["left", "right"]).optional(),
                target: z.string().optional()
            })
        )
        .optional(),

    /** Site locale string like "en" or "fr". */
    locale: z.string().optional(),

    markdown: z
        .object({
            /**
            * Line break behavior in Markdown rendering.
            * "soft" keeps Markdown default, "hard" treats single newline as <br>.
            */
            lineBreaks: z.enum(["soft", "hard"]).optional()
        })
        .optional(),

    /** Global meta tags defaults, for example <title> template. */
    meta: z
        .object({
            /** Template for the document title. */
            title: z.string().optional()
        })
        .optional(),

    nav: z
        .object({
            /**
            * PRO. Sidebar layout mode.
            * "default" renders standard tree, "stack" presents stacked sections.
            */
            mode: z.enum(["default", "stack"]).optional(),

            /** Controls which items show icons in the sidebar. Default: "all". */
            icons: z
                .object({
                    mode: z
                        .enum(["all", "none", "folders", "pages", "top"])
                        .optional()
                })
                .optional()
        })
        .optional(),

    toc: z
        .object({
            /**
            * Table of contents depth. Accepts a number, a range string like "2-4",
            * or a list string like "2,3".
            */
            depth: z.union([z.string(), z.number()]).optional(),
            /** Custom label for the ToC panel. */
            label: z.string().optional()
        })
        .optional()
});

export type RetypeConfig = z.infer<typeof RetypeConfigSchema>;
