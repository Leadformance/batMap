import { LoaderUtils } from '../../src/utils';

describe('LoaderUtils', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('addLoader', () => {
    it('should append the container with the loader element', () => {
      LoaderUtils.addLoader(document.body);

      expect(document.body).toMatchSnapshot();
    });
  });

  it('should return a function to remove the loader element', () => {
    const removeLoader = LoaderUtils.addLoader(document.body);

    expect(document.body).toMatchSnapshot();

    removeLoader();

    expect(document.body).toMatchSnapshot();
  });

  it('should execute the callback function on element removal', () => {
    const callback = jest.fn();
    const removeLoader = LoaderUtils.addLoader(document.body, callback);

    removeLoader();

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
