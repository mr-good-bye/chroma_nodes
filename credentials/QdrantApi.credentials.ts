import type {
	IAuthenticateGeneric,
	// ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class QdrantApi implements ICredentialType {
	name = 'qdrantApi';
	displayName = 'Qdrant API';
	documentationUrl = 'https://docs.n8n.io/integrations/';
	properties: INodeProperties[] = [
		{
			displayName: 'URL',
			name: 'url',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {password: true},
			required: true,
			default: '',
		}
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'api-key': '={{$credentials.ApiKey}}',
			},
		},
	};
}
