#!/usr/bin/env node

/**
 * SVGからPNGアイコンとOG画像を生成するスクリプト
 * Usage: node scripts/generate-icons.mjs
 */

import sharp from 'sharp';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const staticDir = join(__dirname, '..', 'static');

// アイコンサイズ定義
const ICON_SIZES = [
	{ name: 'icon-192.png', size: 192 },
	{ name: 'icon-512.png', size: 512 },
	{ name: 'icon-maskable-192.png', size: 192, maskable: true },
	{ name: 'icon-maskable-512.png', size: 512, maskable: true }
];

// OG画像サイズ
const OG_IMAGE_SIZE = { width: 1200, height: 630 };

/**
 * SVGをPNGに変換
 */
async function svgToPng(svgPath, outputPath, width, height) {
	const svgBuffer = readFileSync(svgPath);

	await sharp(svgBuffer)
		.resize(width, height, {
			fit: 'contain',
			background: { r: 0, g: 0, b: 0, alpha: 0 }
		})
		.png()
		.toFile(outputPath);

	console.log(`Generated: ${outputPath}`);
}

/**
 * マスク可能アイコンを生成（パディング付き）
 */
async function generateMaskableIcon(svgPath, outputPath, size) {
	const svgBuffer = readFileSync(svgPath);

	// マスク可能アイコンは10%のパディングを推奨
	const padding = Math.floor(size * 0.1);
	const innerSize = size - padding * 2;

	const resizedSvg = await sharp(svgBuffer).resize(innerSize, innerSize).toBuffer();

	await sharp({
		create: {
			width: size,
			height: size,
			channels: 4,
			background: { r: 129, g: 140, b: 248, alpha: 1 } // #818cf8
		}
	})
		.composite([
			{
				input: resizedSvg,
				top: padding,
				left: padding
			}
		])
		.png()
		.toFile(outputPath);

	console.log(`Generated (maskable): ${outputPath}`);
}

/**
 * OG画像を生成
 */
async function generateOgImage(svgPath, outputPath) {
	const svgBuffer = readFileSync(svgPath);
	const { width, height } = OG_IMAGE_SIZE;

	// アイコンを中央に配置したOG画像
	const iconSize = 256;
	const iconTop = Math.floor((height - iconSize) / 2);
	const iconLeft = Math.floor((width - iconSize) / 2);

	const resizedSvg = await sharp(svgBuffer).resize(iconSize, iconSize).toBuffer();

	await sharp({
		create: {
			width,
			height,
			channels: 4,
			background: { r: 2, g: 6, b: 23, alpha: 1 } // #020617 (slate-950)
		}
	})
		.composite([
			{
				input: resizedSvg,
				top: iconTop,
				left: iconLeft
			}
		])
		.png()
		.toFile(outputPath);

	console.log(`Generated (OG): ${outputPath}`);
}

async function main() {
	const faviconSvg = join(staticDir, 'favicon.svg');

	if (!existsSync(faviconSvg)) {
		console.error('Error: favicon.svg not found in static directory');
		process.exit(1);
	}

	console.log('Generating PNG icons from SVG...\n');

	try {
		// 通常アイコンとマスク可能アイコンを生成
		for (const icon of ICON_SIZES) {
			const outputPath = join(staticDir, icon.name);

			if (icon.maskable) {
				await generateMaskableIcon(faviconSvg, outputPath, icon.size);
			} else {
				await svgToPng(faviconSvg, outputPath, icon.size, icon.size);
			}
		}

		// OG画像を生成
		const ogImagePath = join(staticDir, 'og-image.png');
		await generateOgImage(faviconSvg, ogImagePath);

		console.log('\nAll icons generated successfully!');
	} catch (error) {
		console.error('Error generating icons:', error);
		process.exit(1);
	}
}

main();
