
# Marketplace page & token info page

The marketplace page is a responsive page used to display tokens to BakeSale customers for purchase.

Users can filter results, click on any token in the shop, and load more tokens using buttons available in the marketplace.

It should be noted that not all component files referenced may appear here - this is a selection of components and pages approved for read-only use designed to showcase the work of the author, Chris Porter.

Visit the page at https://bakesale.world/



## About the code

- Written in TypeScript & React
- Uses several third party libraries
    - react-router (routing)
    - Headless UI (lightly styled component library)
    - Stripe.js (payment flow)
    - lodash (assisting with JavaScript's awkward deep cloning & object comparison)
    - react-icons
    - react-ga (Google Analytics)
- Integrates with a BakeSale API (written in node.js)
    - Pulls data from our PostgreSQL database
## Screenshots

![Marketplace mobile](/screenshots/market_mobile.png)
![Marketplace desktop](/screenshots/market_desktop.png)
![Token info desktop](/screenshots/market_tokeninfo.png)
