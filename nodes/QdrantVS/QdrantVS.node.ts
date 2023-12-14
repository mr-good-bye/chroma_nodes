import type { INodeProperties } from 'n8n-workflow';
import { QdrantVectorStore } from 'langchain/vectorstores/qdrant';
import { createVectorStoreNode } from './createVectorStoreNode';
import { metadataFilterField } from './sharedFields';

const sharedFields: INodeProperties[] = [
	{
		displayName: 'Qdrant Collection Name',
		name: 'collectionName',
		type: 'string',
		default: '',
		required: true,
	},
];

const retrieveFields: INodeProperties[] = [
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [
			{
				displayName: 'Pinecone Namespace',
				name: 'pineconeNamespace',
				type: 'string',
				description:
					'Partition the records in an index into namespaces. Queries and other operations are then limited to one namespace, so different requests can search different subsets of your index.',
				default: '',
			},
			metadataFilterField,
		],
	},
];

const insertFields: INodeProperties[] = [
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [
			{
				displayName: 'Clear Namespace',
				name: 'clearNamespace',
				type: 'boolean',
				default: false,
				description: 'Whether to clear the namespace before inserting new data',
			},
			{
				displayName: 'Pinecone Namespace',
				name: 'pineconeNamespace',
				type: 'string',
				description:
					'Partition the records in an index into namespaces. Queries and other operations are then limited to one namespace, so different requests can search different subsets of your index.',
				default: '',
			},
		],
	},
];
export const QdrantVS = createVectorStoreNode({
	meta: {
		displayName: 'Qdrant Vector Store',
		name: 'QDrant',
		description: 'Work with your data in Qdrant',
		icon: 'file:qdrant.png',
		docsUrl:
			'https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.vectorstoreqdrant/',
		credentials: [
			{
				name: 'qdrantApi',
				required: true,
			},
		],
	},
	retrieveFields,
	loadFields: retrieveFields,
	insertFields,
	sharedFields,
	async getVectorStoreClient(context, filter, embeddings, itemIndex) {
		const index = context.getNodeParameter('collectionName', itemIndex) as string;
		const credentials = await context.getCredentials('qdrantApi');


		const client = new QdrantVectorStore(
			embeddings,
			{
				url: credentials.url as string,
				apiKey: credentials.apiKey as string,
				collectionName: index as string,
			});

		return client;
	},
	async populateVectorStore(context, embeddings, documents, itemIndex) {
		const index = context.getNodeParameter('collectionName', itemIndex) as string;

		const credentials = await context.getCredentials('qdrantApi');

		const QdrantArgs = {
			url: credentials.url as string,
			apiKey: credentials.apiKey as string,
			collectionName: index as string,
		}

		await QdrantVectorStore.fromDocuments(documents, embeddings, QdrantArgs,);
	},
});
