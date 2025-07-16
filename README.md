# Scrum Board Based To-Do Task Scheduler

A beautiful and aesthetically pleasing To-Do List web application built with Next.js and Tailwind CSS. The design emphasizes a classic, timeless feel with clean typography, warm neutral colors, and subtle shadows.

## Features

- **Add New Tasks** - Users can add tasks to their list
- **View Tasks** - See tasks displayed in a visually pleasing list
- **Delete Tasks** - Remove tasks when they're completed
- **Classic UI Design** - Features Georgia font, soft shadows, and warm amber colors
- **Authentication** - Login and signup pages for user access
- **Board Management** - Create and select boards for organizing tasks
- **Responsive Design** - Works seamlessly on all devices

## Technologies Used

- Next.js
- TypeScript
- Tailwind CSS
- React Hooks (useState)
- Supabase (for authentication and database)

## Getting Started

First, clone the repository:

```bash
# Clone the repository
git clone <repository-url>
cd <project-folder>
```

Install the dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

If using Supabase, create a `.env.local` file and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Folder Structure

```
public/           # Static assets
src/app/          # Next.js app directory
src/components/   # Reusable React components
src/lib/          # Utility libraries (db, supabaseClient, etc.)
src/types/        # TypeScript types
```

## Design Choices

The application uses:

- Georgia serif font for a classic feel
- Warm amber color palette
- Soft shadows and rounded corners
- Responsive design that works on all devices

## Implementation

- Tasks are managed in local state using React's useState hook
- Authentication and board management use Supabase
- No backend server required for basic usage

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

For questions or feedback, please contact the project maintainer.
