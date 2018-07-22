export default class {
    constructor({ name, props, renderProps, suffixes, nest } = {}) {
        this.name = name ? name.toString() : undefined;
        this.props = Object.assign({}, props);
        this.renderProps = Object.assign({}, renderProps);
        this.suffixes = [...(suffixes || [])];
        this.nest = nest
            ? {
                  props: Object.assign({}, nest.props),
                  renderProps: Object.assign({}, nest.renderProps),
                  routes: [...(nest.routes || [])],
              }
            : { props: {}, renderProps: {}, routes: [] };
    }
}
