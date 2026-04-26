<?php

/**
 * API Router - Maps HTTP requests to controller methods
 * 
 * Usage: Include this file from index.php, then call Router::dispatch()
 */
class Router
{
    private static array $routes = [];

    public static function get(string $path, callable $handler): void
    {
        self::$routes[] = ['method' => 'GET', 'path' => $path, 'handler' => $handler];
    }

    public static function post(string $path, callable $handler): void
    {
        self::$routes[] = ['method' => 'POST', 'path' => $path, 'handler' => $handler];
    }

    public static function put(string $path, callable $handler): void
    {
        self::$routes[] = ['method' => 'PUT', 'path' => $path, 'handler' => $handler];
    }

    public static function patch(string $path, callable $handler): void
    {
        self::$routes[] = ['method' => 'PATCH', 'path' => $path, 'handler' => $handler];
    }

    public static function delete(string $path, callable $handler): void
    {
        self::$routes[] = ['method' => 'DELETE', 'path' => $path, 'handler' => $handler];
    }

    /**
     * Dispatch the current request to the matching route handler.
     * Supports dynamic segments like {id} in route paths.
     */
    public static function dispatch(): void
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        // Handle CORS preflight
        if ($method === 'OPTIONS') {
            http_response_code(204);
            return;
        }

        foreach (self::$routes as $route) {
            if ($route['method'] !== $method)
                continue;

            // Convert route pattern to regex: /api/books/{id} => /api/books/([^/]+)
            $pattern = preg_replace('/\{([^}]+)\}/', '([^/]+)', $route['path']);
            $pattern = '#^' . $pattern . '$#';

            if (preg_match($pattern, $uri, $matches)) {
                array_shift($matches); // Remove full match
                call_user_func_array($route['handler'], $matches);
                return;
            }
        }

        // No matching route found
        http_response_code(404);
        echo json_encode(['error' => 'Route non trouvée', 'uri' => $uri, 'method' => $method]);
    }
}
