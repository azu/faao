declare module "suitcss-classnames" {
    export = suitcssClassnames;
}

declare function suitcssClassnames(suitCSSObject: suitCSSObject): string;

interface suitCSSObject {
    // class="namespace-Component"
    namespace?: string;
    // class="Component-descendant"
    descendant?: string,
    // class="Component"
    component: string;
    // class="Component--modifier"
    modifiers: string[] | { [index: string]: boolean };
    // class="Component is-state"
    states: string[] | { [index: string]: boolean };
    // class="u-utility Component"
    utilities: string[] | { [index: string]: boolean };
}