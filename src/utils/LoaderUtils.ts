const LOADER_CLASSNAME = 'batmap__spinner';

export class LoaderUtils {
  static addLoader(domElement: HTMLElement, callback?: () => void): () => void {
    const loader = document.createElement('div');
    loader.className = LOADER_CLASSNAME;

    domElement.appendChild(loader);

    return (): void => {
      domElement.removeChild(loader);
      callback && callback();
    };
  }
}
