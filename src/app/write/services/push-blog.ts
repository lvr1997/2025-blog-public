import { NOTES_GITHUB_CONFIG } from '@/consts'
import { getAuthToken } from '@/lib/auth'
import { createBlob, createCommit, createTree, getRef, toBase64Utf8, updateRef, type TreeItem } from '@/lib/github-client'
import { formatDateTimeLocal } from '../stores/write-store'
import type { ImageItem } from '../types'

export type PushBlogParams = {
	form: {
		slug: string
		title: string
		md: string
		tags: string[]
		date?: string
		summary?: string
		hidden?: boolean
		category?: string
	}
	cover?: ImageItem | null
	images?: ImageItem[]
	mode?: 'create' | 'edit'
	originalSlug?: string | null
}

function formatVitePressDate(value?: string) {
	const raw = value || formatDateTimeLocal()
	return raw.replace('T', ' ').slice(0, 16)
}

function stripFrontmatter(markdown: string) {
	return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '').trimStart()
}

function buildNoteMarkdown(form: PushBlogParams['form']) {
	const body = stripFrontmatter(form.md || '')
	const date = formatVitePressDate(form.date)
	const tags = form.tags.map(tag => tag.trim()).filter(Boolean)
	const tagsBlock = tags.length > 0 ? `tags:\n${tags.map(tag => `  - ${JSON.stringify(tag)}`).join('\n')}\n` : ''

	return `---
title: ${form.title}
date: ${date}
${tagsBlock}
---

${body}
`
}

export async function pushBlog(params: PushBlogParams): Promise<void> {
	const { form, mode = 'create', originalSlug } = params

	if (!form.slug) throw new Error('Slug is required')
	if (!form.title) throw new Error('Title is required')
	if (form.md.includes('local-image:')) {
		throw new Error('Markdown still contains local-image placeholders. Please replace them with image-hosting URLs first.')
	}
	if (mode === 'edit' && originalSlug && originalSlug !== form.slug) {
		throw new Error('Changing slug in edit mode is not supported.')
	}

	const token = await getAuthToken()
	const year = String(new Date().getFullYear())
	const path = `${NOTES_GITHUB_CONFIG.POSTS_DIR}/${year}/${form.slug}.md`
	const content = buildNoteMarkdown(form)
	const message = mode === 'edit' ? `Update post: ${form.slug}` : `Add post: ${form.slug}`
	const ref = `heads/${NOTES_GITHUB_CONFIG.BRANCH}`
	const refData = await getRef(token, NOTES_GITHUB_CONFIG.OWNER, NOTES_GITHUB_CONFIG.REPO, ref)
	const blob = await createBlob(token, NOTES_GITHUB_CONFIG.OWNER, NOTES_GITHUB_CONFIG.REPO, toBase64Utf8(content), 'base64')
	const treeItems: TreeItem[] = [
		{
			path,
			mode: '100644',
			type: 'blob',
			sha: blob.sha
		}
	]

	const tree = await createTree(token, NOTES_GITHUB_CONFIG.OWNER, NOTES_GITHUB_CONFIG.REPO, treeItems, refData.sha)
	const commit = await createCommit(token, NOTES_GITHUB_CONFIG.OWNER, NOTES_GITHUB_CONFIG.REPO, message, tree.sha, [refData.sha])
	await updateRef(token, NOTES_GITHUB_CONFIG.OWNER, NOTES_GITHUB_CONFIG.REPO, ref, commit.sha)
}
