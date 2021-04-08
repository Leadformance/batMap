export class DomUtils {
  static addScript(domElement: HTMLElement, src: string): void {
    domElement.appendChild(DomUtils.createScript(src));
  }

  static addStyle(domElement: HTMLElement, href: string): void {
    domElement.appendChild(DomUtils.createStyle(href));
  }

  static addResources(
    domElement: HTMLElement,
    resources: HTMLElement[] = [],
    callback?: () => void,
  ): void {
    if (!resources.length) {
      return callback && callback();
    }

    let nbLoaded = 0;
    resources.forEach(resource => {
      resource.addEventListener('load', () => {
        nbLoaded++;

        if (nbLoaded === resources.length) {
          callback && callback();
        }
      });

      domElement.appendChild(resource);
    });
  }

  static createScript(src: string, async = true): HTMLScriptElement {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.async = async;

    return script;
  }

  static createStyle(href: string): HTMLLinkElement {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = href;

    return style;
  }

  static isHTMLElement(elem: any): boolean {
    return (
      elem &&
      typeof elem === 'object' &&
      elem.nodeType === 1 &&
      typeof elem.nodeName === 'string'
    );
  }
}
