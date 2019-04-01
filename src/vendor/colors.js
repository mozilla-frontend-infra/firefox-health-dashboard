import { frum } from './queryOps';

class Color {}

class RGBAColor extends Color {
  constructor(r, g, b, a = 1) {
    super();
    this.value = [r, g, b, a];
  }

  setOpacity(opacity) {
    this.value[3] = opacity;

    return this;
  }

  toRGBA() {
    return `rgba(${this.value.map(v => `${v}`).join(',')})`;
  }
}

RGBAColor.prototype.toString = RGBAColor.prototype.toRGBA;

Color.parseHTML = html => {
  if (html.startsWith('#')) {
    const temp = frum;

    return new RGBAColor(
      ...temp(html)
        .slice(1)
        .chunk(2)
        .map(vv => Number.parseInt(vv.join(''), 16))
    );
  }
};

Color.invisible = new Color(0, 0, 0, 0);

export default Color;
