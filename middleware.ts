import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 1. Crear el cliente de Supabase para el servidor
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 2. Obtener la sesión del usuario
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // --- DEFINICIÓN DE RUTAS PÚBLICAS ---
  const isPublic = 
    path === '/' ||                       // Intro
    path === '/login' ||                  // Login
    path.startsWith('/carga-diaria') ||   // App Cliente
    path.startsWith('/carga-financiera') || // App Vieja
    path.startsWith('/auth');             // Callbacks

  // --- LÓGICA DE SEGURIDAD ---

  // A. Si NO hay usuario y la ruta NO es pública -> Mandar al Login
  if (!user && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // B. Si HAY usuario y quiere ir a Login o Intro -> Mandar al Dashboard
  if (user && (path === '/login' || path === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}