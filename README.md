# Angular CMS

A CMS backed frontend concept built with Angular Universal, featuring server-side rendering (SSR) and MongoDB integration. This is an exploratory project to see how Angular 19 can help implement a CMS that is SEO friendly, capable of implementing dynamic content (e.g. price of an item or weather today), and produces highly responsive forms.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
Create a `.env` file in the root directory with the following variables:
```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net
DB_NAME=your_database_name
PORT=4200
```

3. Run the application:
```bash
# Build the application
npm run build

# Start the server
npm run serve:ssr:public-site
```

The application will be available at `http://localhost:4200`

## Technical Details

### Architecture

- **Frontend**: Angular Universal with SSR
- **Database**: MongoDB
- **Server**: Express.js with Angular Universal
- **Build System**: Angular CLI

### Key Features

1. **Server-Side Rendering (SSR)**
   - Initial page load is rendered on the server
   - Improved SEO and performance
   - Seamless hydration on client-side

2. **Dynamic Content Management**
   - Content stored in MongoDB collections
   - Flexible page structure
   - Real-time content updates

3. **Performance Optimizations**
   - TransferState for data persistence
   - Route-based code splitting
   - Efficient data loading with resolvers

### Project Structure

```
projects/
  public-site/
    src/
      app/
        resolvers/     # Route resolvers for data loading
        pages/         # Page components
        server/        # Server-side services
      server.ts        # Express server setup
```

### Data Flow

#### Server-Side Rendering Process

1. **Initial Request**:
   - User requests a page (e.g., `/about`)
   - Express server receives the request
   - Angular Universal bootstraps the application

2. **Route Resolution**:
   - Angular router matches the URL to a default route
   - The route configuration in `app.routes.ts` includes a resolver:
   ```typescript
   {
     path: '',
     resolve: {
       pageData: pageDataResolver
     },
     children: [
       {
         path: '',
         loadComponent: () => import('./pages/home/home.component')
       }
     ]
   }
   ```

3. **Resolver Execution**:
   - The `pageDataResolver` is called before the component is loaded
   - Resolver checks if running on server using `isPlatformServer`
   - Fetches data from MongoDB through the API endpoint
   - Stores the data in TransferState

4. **TransferState Usage**:
   - TransferState is Angular's mechanism for transferring data from server to client
   - Data is serialized and embedded in the initial HTML
   - Available immediately when the client-side application bootstraps
   - Prevents unnecessary API calls on client-side navigation

5. **Component Rendering**:
   - Component receives resolved data through `ActivatedRoute.data`
   - Renders the content using the provided data
   - HTML is sent to the client

#### Client-Side Navigation

1. **Route Change**:
   - User navigates to a new page
   - Angular router handles the navigation

2. **Resolver Check**:
   - Resolver is called again
   - Checks TransferState for cached data
   - If found, uses cached data immediately
   - If not found, makes API request

3. **Component Update**:
   - Component receives new data
   - Updates the view without full page reload

#### Server Routes Configuration

The `app.routes.server.ts` file configures server-specific routing:
```typescript
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRouting(serverRoutes)
  ]
};
```

This setup:
- Enables server-side rendering
- Configures server-specific route handling
- Integrates with Express server
- Handles static file serving
- Manages API endpoints



### Development

- **Adding New Pages**:
  1. Create content in MongoDB
  2. Access via URL path matching the slug

- **Modifying Templates**:
  1. Update content in MongoDB
  2. Changes reflect immediately

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| MONGO_URI | MongoDB connection string | Yes |
| DB_NAME | MongoDB database name | Yes |
| PORT | Server port | No (default: 4200) |

### Available Scripts

- `npm run build` - Build the application
- `npm run serve:ssr:public-site` - Start the SSR server
- `npm run dev:ssr:public-site` - Start in development mode with SSR

## AI-Assisted Development

This project was developed with the assistance of AI (Claude) to accelerate the development process and ensure best practices. Here's how AI was utilized:

1. **Architecture Design**:
   - Discussed and refined the initial architecture
   - Developer utilized AI to explore best ways for Server Side Rendering of dynamic templates from backend. Focused on two options, providers and resolvers.
   - Developer utilized AI for ways to cache template data from server to client. AI suggested use of TransferState.

2. **Code Implementation**:
   - Assisted in writing the resolver implementation
   - Helped debug SSR-specific issues
   - Suggested improvements to the MongoDB integration
   - Provided code examples for route configuration
   - Developer asked AI to implement resolver in context of Angular 19 SSR
   - Developer asked AI to enhance resolver to use TransferState for data persistence of results from backend

3. **Problem Solving**:
   - Helped identify and fix the "Only absolute URLs are supported" error
   - Suggested removing MongoDB _id from API responses
   - Assisted in implementing proper error handling
   - Helped optimize the data flow between server and client

4. **Documentation**:
   - Helped create this comprehensive README
   - Documented the data flow and architecture
   - Explained technical concepts like TransferState
   - Provided clear setup instructions

5. **Best Practices**:
   - Ensured proper separation of concerns
   - Implemented efficient data loading patterns
   - Followed Angular Universal best practices
   - Maintained clean and maintainable code structure
