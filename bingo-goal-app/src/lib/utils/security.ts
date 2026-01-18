const ALLOWED_PATHS = ['/', '/boards'] as const;

export function isValidRedirectPath(path: string): boolean {
	if (!path || typeof path !== 'string') return false;

	// プロトコル付きURLを拒否 (https:, http:, javascript:, data: など)
	if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(path)) return false;

	// プロトコル相対URL (//) を拒否
	if (path.startsWith('//')) return false;

	// スラッシュで始まらないパスを拒否
	if (!path.startsWith('/')) return false;

	// クエリパラメータとフラグメントを除去して正規化
	const normalizedPath = path.split('?')[0].split('#')[0];

	// 許可リストに含まれるかチェック
	return ALLOWED_PATHS.some(
		(allowed) => normalizedPath === allowed || normalizedPath.startsWith(allowed + '/')
	);
}

export function getSafeRedirectPath(path: string | null | undefined): string {
	return path && isValidRedirectPath(path) ? path : '/';
}
