<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Industry Standard Architecture Rules
To maintain code quality and scalability, all AI agents MUST follow these structural rules:

1. **Strict Line Limit**: No single `.tsx` or `.ts` file should exceed **200 lines**. If a file grows beyond this, it MUST be refactored into smaller components or hooks.
2. **Logic Separation (Custom Hooks)**:
   - All complex state, API fetching, and business logic must reside in `hooks/`.
   - UI components should only consume data and handle user interactions via these hooks.
3. **Modular Components**:
   - Large pages (`app/`) must be decomposed into sub-components located in `components/[feature_name]/`.
   - Use specialized sub-folders like `components/[feature]/Tabs/` or `components/[feature]/Modals/` for better organization.
4. **Type Centralization**: Centralized interfaces and types should be kept in `components/types/` or relevant feature folders to maintain type safety across the application.
5. **Clean Container Pattern**: `page.tsx` files should act as lightweight containers/orchestrators, ideally staying under **100 lines**.
