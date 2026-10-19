import { NextResponse } from 'next/server';
import { requireAdmin } from '@/shared/lib/auth-helpers';
import { findFormSubmissionsForExport } from '@/shared/lib/form-submissions';

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleString('ru-RU');
}

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function xmlCell(value) {
  return `<Cell><Data ss:Type="String">${escapeXml(value)}</Data></Cell>`;
}

function xmlRow(values) {
  return `<Row>${values.map(xmlCell).join('')}</Row>`;
}

export async function GET(request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const leads = await findFormSubmissionsForExport({ search });

    const headers = [
      'Дата',
      'Источник',
      'Страница',
      'Телефон',
      'Имя',
      'Заголовок',
      'Данные заявки',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'UTM Content',
      'UTM Term',
      'Полные данные',
    ];

    const rows = [
      xmlRow(headers),
      ...leads.map((lead) =>
        xmlRow([
          formatDate(lead.createdAt),
          lead.source || '',
          lead.pagePath || '',
          lead.phone || '',
          lead.name || '',
          lead.title || '',
          lead.comments || '',
          lead.utmSource || '',
          lead.utmMedium || '',
          lead.utmCampaign || '',
          lead.utmContent || '',
          lead.utmTerm || '',
          JSON.stringify(lead.payload ?? {}),
        ]),
      ),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
<Worksheet ss:Name="Заявки">
<Table>${rows.join('')}</Table>
</Worksheet>
</Workbook>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.ms-excel; charset=utf-8',
        'Content-Disposition': 'attachment; filename="leads.xls"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error exporting leads:', error);

    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
