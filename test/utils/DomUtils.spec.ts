import { fireEvent } from '@testing-library/dom';

import { DomUtils } from '../../src/utils';

describe('DomUtils', () => {
  const src = 'http://example.com/script.js';
  const href = 'http://example.com/style.css';

  afterEach(() => {
    document.head.innerHTML = '';
  });

  describe('addScript', () => {
    it('should add a script element into the document', () => {
      DomUtils.addScript(document.head, 'http://example.com/script.js');

      expect(document.head).toMatchSnapshot();
    });
  });

  describe('addStyle', () => {
    it('should add a link element into the document', () => {
      DomUtils.addStyle(document.head, 'http://example.com/style.css');

      expect(document.head).toMatchSnapshot();
    });
  });

  describe('addResources', () => {
    it('should only execute the callback function if the resources are empty', () => {
      const callback = jest.fn();
      DomUtils.addResources(document.head, [], callback);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(document.head).toMatchSnapshot();
    });

    it('should add all resources into the document and execute the callback function once they are all loaded', () => {
      const style = document.createElement('link');
      style.href = href;

      const script = document.createElement('script');
      script.src = src;

      const callback = jest.fn();

      DomUtils.addResources(document.head, [style, script], callback);

      expect(document.head).toMatchSnapshot();
      expect(callback).toHaveBeenCalledTimes(0);

      fireEvent['load'](style);
      expect(callback).toHaveBeenCalledTimes(0);

      fireEvent['load'](script);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('createScript', () => {
    it('should return a script element', () => {
      const script = DomUtils.createScript(src, false);

      expect(script).toMatchSnapshot();
      expect(script).toHaveProperty('async', false);
    });

    it('should return an async script element', () => {
      const script = DomUtils.createScript(src);

      expect(script).toMatchSnapshot();
      expect(script).toHaveProperty('async', true);
    });
  });

  describe('createStyle', () => {
    it('should return a link element with an href attribute', () => {
      expect(DomUtils.createStyle(href)).toMatchSnapshot();
    });
  });

  describe('isHTMLElement', () => {
    it('should return true with an HTML element', () => {
      expect(DomUtils.isHTMLElement(document.createElement('a'))).toEqual(true);
    });

    it('should return false with an object', () => {
      expect(DomUtils.isHTMLElement({ foo: 'bar' })).toEqual(false);
    });

    it('should return false with a string', () => {
      expect(DomUtils.isHTMLElement('foo')).toEqual(false);
    });
  });
});
