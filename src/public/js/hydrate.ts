async function hydrate(components: string[] = []) {
  const lhsReady = import('lit/experimental-hydrate-support.js');
  if (!HTMLTemplateElement.prototype.hasOwnProperty('shadowRoot')) {
    const { hydrateShadowRoots } = await import(
      '@webcomponents/template-shadowroot/template-shadowroot.js'
    );
    hydrateShadowRoots(document.body);
    document.body.removeAttribute('unresolved');
  }
  await lhsReady;
  for (const component of components) {
    import(component);
  }
}

export { hydrate };
