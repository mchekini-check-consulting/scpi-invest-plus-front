import { AuthService } from "@/core/service/auth.service";

export function authAppInitializerFactory(
  authService: AuthService
): () => Promise<void> {
  return () => authService.runInitialLoginSequence();
}
