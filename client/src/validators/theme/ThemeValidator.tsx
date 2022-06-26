const ThemeValidator = () => {
  try {
    {
      // @ts-ignore
      localStorage.getItem('theme') &&
        // @ts-ignore
        document.body.setAttribute('class', localStorage.getItem('theme'));
    }
  } catch (e) {
    localStorage.setItem('theme', 'dark');
  }
};

export default ThemeValidator;
