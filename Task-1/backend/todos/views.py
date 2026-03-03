from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import connection
from .models import Todo
from .serializers import TodoSerializer

class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

@api_view(['GET'])
def health_check(request):
    try:
        connection.ensure_connection()
        return Response({'status': 'healthy', 'database': 'connected'})
    except Exception as e:
        return Response(
            {'status': 'unhealthy', 'database': 'disconnected', 'error': str(e)},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
