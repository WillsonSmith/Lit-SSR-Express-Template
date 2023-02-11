import { isServer } from 'lit';

if (!isServer) {
  import('@shoelace-style/shoelace/dist/components/button/button.js');
  import('@shoelace-style/shoelace/dist/components/card/card.js');
}
